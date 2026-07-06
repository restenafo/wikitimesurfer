import {
  Component,
  ElementRef,
  computed,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { uiStrings } from '../../core/ui-strings';
import { RevisionMeta } from '../../core/models';

interface MonthBucket {
  year: number;
  month: number; // 0-11
  label: string;
  x: number;
  count: number;
  userCount: number;
  /** indice (nella lista completa) della prima revisione del mese; -1 se mese vuoto */
  firstIndex: number;
}

interface BarSegment {
  path: string;
  cls: 'main' | 'other';
}

interface BarRender {
  bucket: MonthBucket;
  segments: BarSegment[];
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
})
export class Timeline {
  revisions = input.required<RevisionMeta[]>();
  currentIndex = input.required<number>();
  filterUser = input<string | null>(null);
  jumpTo = output<number>();

  readonly t = uiStrings();

  // geometria (px)
  readonly PITCH = 10;
  readonly BARW = 8;
  readonly PLOT_H = 72;
  readonly TOP = 14;
  readonly BOTTOM = 20;
  readonly HEIGHT = this.TOP + this.PLOT_H + this.BOTTOM;

  hover = signal<{ b: MonthBucket; x: number; y: number } | null>(null);

  private wrapper = viewChild<ElementRef<HTMLDivElement>>('wrapper');
  private scroller = viewChild<ElementRef<HTMLDivElement>>('scroller');

  private monthFmt = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' });

  buckets = computed<MonthBucket[]>(() => {
    const revs = this.revisions();
    const f = this.filterUser();
    if (!revs.length) return [];
    const out: MonthBucket[] = [];
    const map = new Map<string, MonthBucket>();
    const first = new Date(revs[0].timestamp);
    const last = new Date(revs[revs.length - 1].timestamp);
    let y = first.getUTCFullYear();
    let m = first.getUTCMonth();
    const endY = last.getUTCFullYear();
    const endM = last.getUTCMonth();
    while (y < endY || (y === endY && m <= endM)) {
      const b: MonthBucket = {
        year: y,
        month: m,
        label: this.monthFmt.format(new Date(Date.UTC(y, m, 1))),
        x: out.length * this.PITCH + 1,
        count: 0,
        userCount: 0,
        firstIndex: -1,
      };
      out.push(b);
      map.set(`${y}-${m}`, b);
      m++;
      if (m === 12) {
        m = 0;
        y++;
      }
    }
    revs.forEach((r, idx) => {
      const d = new Date(r.timestamp);
      const b = map.get(`${d.getUTCFullYear()}-${d.getUTCMonth()}`);
      if (!b) return;
      b.count++;
      if (b.firstIndex < 0) b.firstIndex = idx;
      if (f && r.user === f) b.userCount++;
    });
    return out;
  });

  maxCount = computed(() => Math.max(1, ...this.buckets().map((b) => b.count)));

  niceMax = computed(() => {
    const m = this.maxCount();
    const pow = 10 ** Math.floor(Math.log10(m));
    for (const k of [1, 2, 5, 10]) {
      if (k * pow >= m) return k * pow;
    }
    return 10 * pow;
  });

  midLabel = computed<string | null>(() => {
    const half = this.niceMax() / 2;
    return Number.isInteger(half) ? half.toLocaleString('it-IT') : null;
  });

  width = computed(() => this.buckets().length * this.PITCH + 2);

  bars = computed<BarRender[]>(() => {
    const f = this.filterUser();
    const nice = this.niceMax();
    const bot = this.TOP + this.PLOT_H;
    const h = (c: number) => (c > 0 ? Math.max(1.5, (this.PLOT_H * c) / nice) : 0);
    return this.buckets().map((b) => {
      const segments: BarSegment[] = [];
      if (b.count > 0) {
        if (f) {
          const other = b.count - b.userCount;
          const hu = h(b.userCount);
          const ho = h(other);
          if (b.userCount > 0 && other > 0) {
            const gap = Math.min(2, ho - 1);
            segments.push({ path: this.barPath(b.x, bot - hu, hu, false), cls: 'main' });
            segments.push({ path: this.barPath(b.x, bot - hu - ho, ho - gap, true), cls: 'other' });
          } else if (b.userCount > 0) {
            segments.push({ path: this.barPath(b.x, bot - hu, hu, true), cls: 'main' });
          } else {
            segments.push({ path: this.barPath(b.x, bot - ho, ho, true), cls: 'other' });
          }
        } else {
          const hc = h(b.count);
          segments.push({ path: this.barPath(b.x, bot - hc, hc, true), cls: 'main' });
        }
      }
      return { bucket: b, segments };
    });
  });

  yearTicks = computed(() => {
    const bs = this.buckets();
    if (!bs.length) return [];
    const januaries = bs.filter((b) => b.month === 0);
    const ticks = bs[0].month !== 0 ? [bs[0], ...januaries] : januaries;
    const step = Math.max(1, Math.ceil(ticks.length / 40));
    return ticks.filter((_, i) => i % step === 0);
  });

  markerX = computed<number | null>(() => {
    const r = this.revisions()[this.currentIndex()];
    if (!r) return null;
    const d = new Date(r.timestamp);
    const b = this.buckets().find(
      (bk) => bk.year === d.getUTCFullYear() && bk.month === d.getUTCMonth(),
    );
    return b ? b.x + this.BARW / 2 : null;
  });

  ariaLabel = computed(
    () =>
      `${this.t.timelineTitle}: ${this.revisions().length.toLocaleString('it-IT')} ${this.t.timelineEdits}`,
  );

  constructor() {
    // mantiene visibile il marcatore della versione corrente
    effect(() => {
      const x = this.markerX();
      const el = this.scroller()?.nativeElement;
      if (x == null || !el || typeof el.scrollTo !== 'function') return;
      if (x < el.scrollLeft + 24 || x > el.scrollLeft + el.clientWidth - 24) {
        el.scrollTo({ left: Math.max(0, x - el.clientWidth / 2), behavior: 'smooth' });
      }
    });
  }

  fmt(n: number): string {
    return n.toLocaleString('it-IT');
  }

  onHover(b: MonthBucket, ev: PointerEvent): void {
    const host = this.wrapper()?.nativeElement;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    this.hover.set({ b, x: ev.clientX - rect.left, y: ev.clientY - rect.top });
  }

  onClick(b: MonthBucket): void {
    if (b.firstIndex >= 0) this.jumpTo.emit(b.firstIndex);
  }

  /** Barra con angoli superiori arrotondati (4px max) e base squadrata sull'asse. */
  private barPath(x: number, y: number, hgt: number, roundedTop: boolean): string {
    const w = this.BARW;
    const bot = y + hgt;
    if (!roundedTop || hgt < 3) return `M${x},${y} H${x + w} V${bot} H${x} Z`;
    const r = 3;
    return `M${x},${bot} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${bot} Z`;
  }
}
