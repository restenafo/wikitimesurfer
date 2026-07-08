import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RevisionMeta } from '../../core/models';
import { WikipediaApiService } from '../../core/wikipedia-api.service';
import { Viewer } from './viewer';

const REVS_DESC: RevisionMeta[] = [
  {
    revid: 3,
    parentid: 2,
    timestamp: '2024-05-10T12:00:00Z',
    user: 'Alice',
    userHidden: false,
    anon: false,
    comment: 'terza',
    commentHidden: false,
    minor: false,
    size: 300,
    delta: null,
  },
  {
    revid: 2,
    parentid: 1,
    timestamp: '2024-04-01T10:00:00Z',
    user: 'Bob',
    userHidden: false,
    anon: false,
    comment: 'seconda',
    commentHidden: false,
    minor: true,
    size: 200,
    delta: null,
  },
  {
    revid: 1,
    parentid: 0,
    timestamp: '2024-03-01T09:00:00Z',
    user: 'Alice',
    userHidden: false,
    anon: false,
    comment: 'prima',
    commentHidden: false,
    minor: false,
    size: 100,
    delta: null,
  },
];

class ApiStub {
  editions = [{ code: 'it', label: 'Italiano' }];
  async getEditCount(): Promise<number | null> {
    return 3;
  }
  async loadHistory(
    _lang: string,
    title: string,
    onBatch: (b: RevisionMeta[]) => void,
  ): Promise<{ normalizedTitle: string }> {
    onBatch(REVS_DESC);
    return { normalizedTitle: title };
  }
  async getRevisionHtml(_lang: string, revid: number): Promise<string> {
    return `<div class="mw-parser-output"><p>contenuto della revisione ${revid}</p></div>`;
  }
  articleUrl = () => 'https://it.wikipedia.org/wiki/Test';
  historyUrl = () => 'https://it.wikipedia.org/w/index.php?title=Test&action=history';
  revisionUrl = (_l: string, _t: string, r: number) => `https://it.wikipedia.org/?oldid=${r}`;
  userUrl = (_l: string, u: string) => `https://it.wikipedia.org/wiki/Special:Contributions/${u}`;
}

describe('Viewer', () => {
  beforeEach(async () => {
    // le asserzioni verificano i testi italiani: fissa la lingua della UI
    localStorage.setItem('wts.uilang', 'it');
    await TestBed.configureTestingModule({
      imports: [Viewer],
      providers: [
        provideRouter([{ path: ':lang/:title', component: Viewer }]),
        { provide: WikipediaApiService, useClass: ApiStub },
      ],
    }).compileComponents();
  });

  async function create() {
    const harness = (await import('@angular/router/testing')).RouterTestingHarness;
    const h = await harness.create('/it/Test?rev=3');
    const viewer = h.routeDebugElement!.componentInstance as Viewer;
    await h.fixture.whenStable();
    h.detectChanges();
    return { h, viewer };
  }

  it('loads history, shows the current revision and its author', async () => {
    const { h, viewer } = await create();
    expect(viewer.revisions().length).toBe(3);
    expect(viewer.currentIndex()).toBe(2); // ultima versione
    const el = h.fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Alice');
    expect(el.textContent).toContain('terza');
  });

  it('navigates with step() and computes byte deltas', async () => {
    const { h, viewer } = await create();
    viewer.step(-1);
    await h.fixture.whenStable();
    h.detectChanges();
    expect(viewer.current()?.revid).toBe(2);
    expect(viewer.current()?.delta).toBe(100); // 200 - 100
    const el = h.fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('modifica minore');
  });

  it('filters navigation by user', async () => {
    const { h, viewer } = await create();
    viewer.selectUser('Alice');
    h.detectChanges();
    expect(viewer.seq()).toEqual([0, 2]); // solo le revisioni di Alice
    viewer.step(-1);
    expect(viewer.current()?.revid).toBe(1); // salta la revisione di Bob
  });
});
