import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  afterRenderEffect,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DiffService } from '../../core/diff.service';
import { uiStrings } from '../../core/ui-strings';
import { RevisionMeta } from '../../core/models';
import { WikipediaApiService } from '../../core/wikipedia-api.service';
import { collectChangeGroups } from './change-groups';
import { Timeline } from './timeline';

const WIKI_CSS_ID = 'wts-wiki-css';

@Component({
  selector: 'app-viewer',
  imports: [RouterLink, Timeline],
  templateUrl: './viewer.html',
  styleUrl: './viewer.scss',
})
export class Viewer implements OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(WikipediaApiService);
  private diff = inject(DiffService);
  private titleSrv = inject(Title);

  readonly t = uiStrings();

  lang = signal('it');
  normalizedTitle = signal('');

  /** revisioni come arrivano dall'API (dalla più recente alla più antica) */
  private revsDesc = signal<RevisionMeta[]>([]);
  historyLoading = signal(true);
  historyError = signal<string | null>(null);
  totalCount = signal<number | null>(null);

  currentRevId = signal<number | null>(null);
  userFilter = signal<string | null>(null);

  diffHtml = signal<SafeHtml | null>(null);
  diffLoading = signal(false);
  diffError = signal<string | null>(null);

  /** blocchi di modifica navigabili nella pagina corrente */
  changeGroups = signal<HTMLElement[][]>([]);
  /** posizione corrente nel navigatore delle modifiche (-1 = nessun salto ancora) */
  currentChange = signal(-1);
  /** mostra il pulsante "torna su" quando la pagina è scorsa in basso */
  showTop = signal(false);

  private articleRef = viewChild<ElementRef<HTMLElement>>('articleEl');

  private abort: AbortController | null = null;
  private diffSeq = 0;
  /** revisione richiesta via ?rev= non ancora presente nei batch caricati */
  private pendingRevId: number | null = null;

  private dateFmt = new Intl.DateTimeFormat('it-IT', { dateStyle: 'long', timeStyle: 'short' });

  /** cronologia in ordine cronologico (indice 0 = prima versione) con delta byte */
  revisions = computed<RevisionMeta[]>(() => {
    const asc = [...this.revsDesc()].reverse();
    const loading = this.historyLoading();
    return asc.map((r, i) => ({
      ...r,
      // il delta della più antica caricata è noto solo a caricamento finito
      delta: i === 0 ? (loading ? null : r.size) : r.size - asc[i - 1].size,
    }));
  });

  currentIndex = computed(() => {
    const id = this.currentRevId();
    return id == null ? -1 : this.revisions().findIndex((r) => r.revid === id);
  });

  current = computed<RevisionMeta | null>(() => this.revisions()[this.currentIndex()] ?? null);

  /** sequenza di navigazione attiva: indici della lista completa (eventualmente filtrata per utente) */
  seq = computed<number[]>(() => {
    const f = this.userFilter();
    const out: number[] = [];
    this.revisions().forEach((r, i) => {
      if (!f || r.user === f) out.push(i);
    });
    return out;
  });

  posInSeq = computed(() => this.seq().indexOf(this.currentIndex()));
  canPrev = computed(() => this.posInSeq() > 0);
  canNext = computed(() => {
    const p = this.posInSeq();
    return p >= 0 && p < this.seq().length - 1;
  });

  progressPct = computed(() => {
    const tot = this.totalCount();
    if (!tot) return null;
    return Math.min(100, Math.round((this.revisions().length / tot) * 100));
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((pm) => {
      const lang = pm.get('lang') ?? 'it';
      const title = decodeURIComponent(pm.get('title') ?? '');
      this.startLoad(lang, title);
    });

    // carica il diff a ogni cambio di revisione corrente
    effect(() => {
      const id = this.currentRevId();
      if (id != null) untracked(() => void this.loadDiff(id));
    });

    // link condivisibile: ?rev=<id>
    effect(() => {
      const id = this.currentRevId();
      if (id == null) return;
      untracked(() =>
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { rev: id },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        }),
      );
    });

    effect(() => {
      const title = this.normalizedTitle();
      if (title) this.titleSrv.setTitle(`${title} — ${this.t.appName}`);
    });

    // dopo ogni nuovo diff renderizzato, raccoglie i blocchi di modifica
    afterRenderEffect(() => {
      this.diffHtml();
      const el = this.articleRef()?.nativeElement;
      untracked(() => {
        this.changeGroups.set(el ? collectChangeGroups(el) : []);
        this.currentChange.set(-1);
      });
    });
  }

  ngOnDestroy(): void {
    this.abort?.abort();
    document.getElementById(WIKI_CSS_ID)?.remove();
  }

  // ---------- caricamento ----------

  private startLoad(lang: string, title: string): void {
    this.abort?.abort();
    const ac = new AbortController();
    this.abort = ac;

    this.lang.set(lang);
    this.normalizedTitle.set(title);
    this.revsDesc.set([]);
    this.historyLoading.set(true);
    this.historyError.set(null);
    this.totalCount.set(null);
    this.currentRevId.set(null);
    this.userFilter.set(null);
    this.diffHtml.set(null);
    this.diffError.set(null);

    this.setWikiStyles(lang);

    const revParam = Number(this.route.snapshot.queryParamMap.get('rev'));
    this.pendingRevId = Number.isFinite(revParam) && revParam > 0 ? revParam : null;

    this.api.getEditCount(lang, title).then((c) => {
      if (!ac.signal.aborted && c) this.totalCount.set(c);
    });

    this.api
      .loadHistory(
        lang,
        title,
        (batch) => {
          if (ac.signal.aborted) return;
          const firstBatch = this.revsDesc().length === 0;
          this.revsDesc.update((a) => [...a, ...batch]);
          if (this.pendingRevId != null) {
            if (batch.some((r) => r.revid === this.pendingRevId)) {
              this.currentRevId.set(this.pendingRevId);
              this.pendingRevId = null;
            }
          } else if (firstBatch) {
            this.currentRevId.set(batch[0].revid); // versione attuale
          }
        },
        ac.signal,
      )
      .then(({ normalizedTitle }) => {
        if (ac.signal.aborted) return;
        this.normalizedTitle.set(normalizedTitle);
        this.historyLoading.set(false);
        // ?rev= inesistente: torna alla versione attuale
        if (this.pendingRevId != null || this.currentIndex() < 0) {
          this.pendingRevId = null;
          const revs = this.revsDesc();
          if (revs.length) this.currentRevId.set(revs[0].revid);
        }
      })
      .catch((e: Error) => {
        if (ac.signal.aborted) return;
        this.historyLoading.set(false);
        this.historyError.set(e.message === 'missing' ? this.t.notFound : this.t.historyError);
      });
  }

  retry(): void {
    this.startLoad(this.lang(), this.normalizedTitle());
  }

  private async loadDiff(revid: number): Promise<void> {
    const seq = ++this.diffSeq;
    this.diffLoading.set(true);
    this.diffError.set(null);
    const lang = untracked(() => this.lang());
    const meta = untracked(() => this.revsDesc()).find((r) => r.revid === revid);
    const parentId = meta?.parentid ?? 0;
    try {
      const [afterHtml, beforeHtml] = await Promise.all([
        this.api.getRevisionHtml(lang, revid),
        parentId > 0
          ? this.api.getRevisionHtml(lang, parentId)
          : Promise.resolve<string | null>(null),
      ]);
      if (seq !== this.diffSeq) return;
      // lascia dipingere lo spinner prima del diff sincrono
      await new Promise((r) => setTimeout(r));
      if (seq !== this.diffSeq) return;
      this.diffHtml.set(this.diff.buildDiffView(beforeHtml, afterHtml, lang));
      this.prefetchNeighbours(lang);
    } catch {
      if (seq === this.diffSeq) this.diffError.set(this.t.diffError);
    } finally {
      if (seq === this.diffSeq) this.diffLoading.set(false);
    }
  }

  /** precarica l'HTML delle revisioni adiacenti per una navigazione fluida */
  private prefetchNeighbours(lang: string): void {
    const seqArr = untracked(() => this.seq());
    const revs = untracked(() => this.revisions());
    const pos = untracked(() => this.posInSeq());
    for (const p of [pos + 1, pos - 1]) {
      const idx = seqArr[p];
      const rid = idx != null ? revs[idx]?.revid : undefined;
      if (rid) this.api.getRevisionHtml(lang, rid).catch(() => {});
    }
  }

  private setWikiStyles(lang: string): void {
    let link = document.getElementById(WIKI_CSS_ID) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = WIKI_CSS_ID;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    const href = `https://${lang}.wikipedia.org/w/load.php?lang=${lang}&modules=site.styles%7Cext.cite.styles&only=styles&skin=vector`;
    if (link.href !== href) link.href = href;
  }

  // ---------- navigazione ----------

  goTo(index: number): void {
    const r = this.revisions()[index];
    if (r) this.currentRevId.set(r.revid);
  }

  step(dir: 1 | -1): void {
    const seq = this.seq();
    const pos = this.posInSeq();
    if (pos < 0) return;
    const np = pos + dir;
    if (np >= 0 && np < seq.length) this.goTo(seq[np]);
  }

  goFirst(): void {
    const seq = this.seq();
    if (seq.length) this.goTo(seq[0]);
  }

  goLast(): void {
    const seq = this.seq();
    if (seq.length) this.goTo(seq[seq.length - 1]);
  }

  onScrub(ev: Event): void {
    const v = Number((ev.target as HTMLInputElement).value);
    const idx = this.seq()[v];
    if (idx != null) this.goTo(idx);
  }

  onTimelineJump(index: number): void {
    const seq = this.seq();
    const target = seq.find((i) => i >= index) ?? seq[seq.length - 1];
    if (target != null) this.goTo(target);
  }

  // ---------- navigazione tra le modifiche nella pagina ----------

  nextChange(): void {
    const groups = this.changeGroups();
    if (!groups.length) return;
    const i = this.currentChange();
    this.jumpToChange(i < 0 ? 0 : Math.min(i + 1, groups.length - 1));
  }

  prevChange(): void {
    const groups = this.changeGroups();
    if (!groups.length) return;
    const i = this.currentChange();
    this.jumpToChange(i < 0 ? groups.length - 1 : Math.max(i - 1, 0));
  }

  private jumpToChange(i: number): void {
    const group = this.changeGroups()[i];
    if (!group) return;
    this.currentChange.set(i);
    group[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    for (const el of group) {
      // riavvia l'animazione anche su salti ripetuti sullo stesso blocco
      el.classList.remove('wts-flash');
      void el.offsetWidth;
      el.classList.add('wts-flash');
      setTimeout(() => el.classList.remove('wts-flash'), 1500);
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showTop.set(window.scrollY > 400);
  }

  selectUser(user: string): void {
    if (this.userFilter() === user) return;
    this.userFilter.set(user);
  }

  clearFilter(): void {
    this.userFilter.set(null);
  }

  @HostListener('window:keydown', ['$event'])
  onKey(ev: KeyboardEvent): void {
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    const tgt = ev.target as HTMLElement | null;
    if (tgt && ['INPUT', 'TEXTAREA', 'SELECT'].includes(tgt.tagName)) {
      // il cursore (range) segue le stesse scorciatoie; gli altri campi restano liberi
      if ((tgt as HTMLInputElement).type !== 'range') return;
    }
    switch (ev.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.step(-1);
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.step(1);
        break;
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.prevChange();
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.nextChange();
        break;
      case 't':
      case 'T':
        this.scrollToTop();
        break;
      case 'Home':
        if (this.historyLoading()) return;
        this.goFirst();
        break;
      case 'End':
        this.goLast();
        break;
      default:
        return;
    }
    ev.preventDefault();
  }

  /** ancore interne (note a piè di pagina): scroll locale invece di navigazione */
  onArticleClick(ev: MouseEvent): void {
    const a = (ev.target as HTMLElement).closest('a');
    if (!a) return;
    const href = a.getAttribute('href') ?? '';
    if (!href.startsWith('#')) return;
    ev.preventDefault();
    const id = decodeURIComponent(href.slice(1));
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ---------- helper di presentazione ----------

  formatDate(ts: string): string {
    return this.dateFmt.format(new Date(ts));
  }

  fmt(n: number): string {
    return n.toLocaleString('it-IT');
  }

  deltaLabel(rev: RevisionMeta): string {
    if (rev.delta == null) return '';
    const sign = rev.delta > 0 ? '+' : '';
    return `${sign}${this.fmt(rev.delta)} ${this.t.bytes}`;
  }

  articleUrl(): string {
    return this.api.articleUrl(this.lang(), this.normalizedTitle());
  }

  historyUrl(): string {
    return this.api.historyUrl(this.lang(), this.normalizedTitle());
  }

  revisionUrl(revid: number): string {
    return this.api.revisionUrl(this.lang(), this.normalizedTitle(), revid);
  }

  userUrl(user: string): string {
    return this.api.userUrl(this.lang(), user);
  }
}
