import { Injectable } from '@angular/core';
import { RevisionMeta, WikiEdition } from './models';

/** Header identificativo richiesto dall'etiquette delle API Wikimedia (supportato in CORS). */
const API_HEADERS = {
  'Api-User-Agent': 'WikiTimeSurfer/1.0 (https://wikitimesurfer.com; re.stefano@gmail.com)',
};

const PARSE_CACHE_MAX = 40;

@Injectable({ providedIn: 'root' })
export class WikipediaApiService {
  readonly editions: WikiEdition[] = [
    { code: 'it', label: 'Italiano' },
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'pt', label: 'Português' },
    { code: 'nl', label: 'Nederlands' },
    { code: 'pl', label: 'Polski' },
    { code: 'sv', label: 'Svenska' },
    { code: 'ca', label: 'Català' },
    { code: 'ru', label: 'Русский' },
    { code: 'ja', label: '日本語' },
    { code: 'zh', label: '中文' },
    { code: 'ar', label: 'العربية' },
  ];

  /** LRU cache dell'HTML renderizzato per revisione (chiave `lang:revid`). */
  private parseCache = new Map<string, string>();

  private async get(
    lang: string,
    params: Record<string, string>,
    signal?: AbortSignal,
  ): Promise<any> {
    const q = new URLSearchParams({
      format: 'json',
      formatversion: '2',
      origin: '*',
      ...params,
    });
    const res = await fetch(`https://${lang}.wikipedia.org/w/api.php?${q}`, {
      headers: API_HEADERS,
      signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error.info ?? data.error.code ?? 'API error');
    return data;
  }

  async searchTitles(lang: string, query: string, signal?: AbortSignal): Promise<string[]> {
    if (!query.trim()) return [];
    const data = await this.get(
      lang,
      { action: 'query', list: 'prefixsearch', pssearch: query.trim(), pslimit: '8' },
      signal,
    );
    return (data.query?.prefixsearch ?? []).map((p: { title: string }) => p.title);
  }

  /** Numero totale di modifiche (REST API); null se non disponibile. */
  async getEditCount(lang: string, title: string): Promise<number | null> {
    try {
      const res = await fetch(
        `https://${lang}.wikipedia.org/w/rest.php/v1/page/${encodeURIComponent(
          title.replace(/ /g, '_'),
        )}/history/counts/edits`,
        { headers: API_HEADERS },
      );
      if (!res.ok) return null;
      const d = await res.json();
      return typeof d.count === 'number' ? d.count : null;
    } catch {
      return null;
    }
  }

  /**
   * Carica l'intera cronologia (dalla più recente alla più antica), invocando
   * `onBatch` dopo ogni pagina API così la UI resta reattiva durante il caricamento.
   */
  async loadHistory(
    lang: string,
    title: string,
    onBatch: (batch: RevisionMeta[]) => void,
    signal: AbortSignal,
  ): Promise<{ normalizedTitle: string }> {
    let cont: string | undefined;
    let normalized = title;
    do {
      const params: Record<string, string> = {
        action: 'query',
        prop: 'revisions',
        titles: title,
        redirects: '1',
        rvprop: 'ids|timestamp|user|comment|size|flags',
        rvlimit: 'max',
        rvdir: 'older',
      };
      if (cont) params['rvcontinue'] = cont;
      const data = await this.get(lang, params, signal);
      const page = data.query?.pages?.[0];
      if (!page || page.missing) throw new Error('missing');
      normalized = page.title ?? normalized;
      const revs: RevisionMeta[] = (page.revisions ?? []).map((r: any) => ({
        revid: r.revid,
        parentid: r.parentid ?? 0,
        timestamp: r.timestamp,
        user: r.user ?? '',
        userHidden: !!r.userhidden,
        anon: !!r.anon,
        comment: r.comment ?? '',
        commentHidden: !!r.commenthidden,
        minor: !!r.minor,
        size: r.size ?? 0,
        delta: null,
      }));
      if (revs.length) onBatch(revs);
      cont = data.continue?.rvcontinue;
      // piccola pausa di cortesia tra le richieste paginated
      if (cont) await new Promise((r) => setTimeout(r, 120));
    } while (cont && !signal.aborted);
    return { normalizedTitle: normalized };
  }

  /** HTML renderizzato di una revisione (con cache LRU). */
  async getRevisionHtml(lang: string, revid: number, signal?: AbortSignal): Promise<string> {
    const key = `${lang}:${revid}`;
    const hit = this.parseCache.get(key);
    if (hit !== undefined) {
      // rinfresca la posizione LRU
      this.parseCache.delete(key);
      this.parseCache.set(key, hit);
      return hit;
    }
    const data = await this.get(
      lang,
      {
        action: 'parse',
        oldid: String(revid),
        prop: 'text',
        disableeditsection: '1',
        disablelimitreport: '1',
      },
      signal,
    );
    const html: string = data.parse?.text ?? '';
    this.parseCache.set(key, html);
    while (this.parseCache.size > PARSE_CACHE_MAX) {
      this.parseCache.delete(this.parseCache.keys().next().value!);
    }
    return html;
  }

  private wikiTitle(title: string): string {
    return encodeURIComponent(title.replace(/ /g, '_'));
  }

  articleUrl(lang: string, title: string): string {
    return `https://${lang}.wikipedia.org/wiki/${this.wikiTitle(title)}`;
  }

  revisionUrl(lang: string, title: string, revid: number): string {
    return `https://${lang}.wikipedia.org/w/index.php?title=${this.wikiTitle(title)}&oldid=${revid}`;
  }

  historyUrl(lang: string, title: string): string {
    return `https://${lang}.wikipedia.org/w/index.php?title=${this.wikiTitle(title)}&action=history`;
  }

  userUrl(lang: string, user: string): string {
    return `https://${lang}.wikipedia.org/wiki/Special:Contributions/${encodeURIComponent(user)}`;
  }
}
