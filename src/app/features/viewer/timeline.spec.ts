import { TestBed } from '@angular/core/testing';
import { RevisionMeta } from '../../core/models';
import { Timeline } from './timeline';

function makeRevs(): RevisionMeta[] {
  const revs: RevisionMeta[] = [];
  // 24 revisioni distribuite su 12 mesi (2 al mese), autori alternati
  for (let i = 0; i < 24; i++) {
    const month = Math.floor(i / 2);
    revs.push({
      revid: 1000 + i,
      parentid: i === 0 ? 0 : 999 + i,
      timestamp: new Date(Date.UTC(2023, month, 3 + (i % 2) * 10)).toISOString(),
      user: i % 2 === 0 ? 'Alice' : 'Bob',
      userHidden: false,
      anon: false,
      comment: `modifica ${i}`,
      commentHidden: false,
      minor: false,
      size: 100 + i,
      delta: null,
    });
  }
  return revs;
}

describe('Timeline', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Timeline] }).compileComponents();
  });

  function create(filterUser: string | null = null) {
    const fixture = TestBed.createComponent(Timeline);
    fixture.componentRef.setInput('revisions', makeRevs());
    fixture.componentRef.setInput('currentIndex', 23);
    fixture.componentRef.setInput('filterUser', filterUser);
    fixture.detectChanges();
    return fixture;
  }

  it('renders one bar per month and the current-position marker', () => {
    const fixture = create();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('path.bar').length).toBe(12);
    expect(el.querySelector('line.marker')).toBeTruthy();
    expect(el.textContent).toContain('24');
  });

  it('stacks user vs other edits and shows the legend when filtered', () => {
    const fixture = create('Alice');
    const el = fixture.nativeElement as HTMLElement;
    // ogni mese ha modifiche di Alice e di altri → 2 segmenti per barra
    expect(el.querySelectorAll('path.bar').length).toBe(24);
    expect(el.querySelectorAll('path.bar.other').length).toBe(12);
    expect(el.textContent).toContain('Alice');
  });

  it('emits jumpTo with the first revision index of the clicked month', () => {
    const fixture = create();
    let emitted: number | null = null;
    fixture.componentInstance.jumpTo.subscribe((i: number) => (emitted = i));
    const hits = fixture.nativeElement.querySelectorAll('rect.hit');
    (hits[3] as SVGRectElement).dispatchEvent(new MouseEvent('click'));
    expect(emitted).toBe(6); // mese 4 → prima revisione = indice 6
  });
});
