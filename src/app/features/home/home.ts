import { Component, computed, effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LanguageService } from '../../core/language.service';
import { uiStrings } from '../../core/ui-strings';
import { WikipediaApiService } from '../../core/wikipedia-api.service';

const LANG_KEY = 'wts.lang';

const EXAMPLES: Record<string, string[]> = {
  it: ['Roma', 'Intelligenza artificiale', 'Divina Commedia'],
  en: ['Rome', 'Artificial intelligence', 'World War II'],
  de: ['Berlin', 'Künstliche Intelligenz'],
  fr: ['Paris', 'Intelligence artificielle'],
  es: ['Madrid', 'Inteligencia artificial'],
};

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private api = inject(WikipediaApiService);
  private router = inject(Router);
  private titleSrv = inject(Title);
  private language = inject(LanguageService);

  readonly t = computed(() => uiStrings(this.language.current()));
  readonly editions = this.api.editions;

  lang = signal(this.defaultEdition());
  query = signal('');
  suggestions = signal<string[]>([]);

  private debounce?: ReturnType<typeof setTimeout>;
  private searchAbort?: AbortController;

  constructor() {
    effect(() => this.titleSrv.setTitle(`${this.t().appName} — ${this.t().tagline}`));
  }

  /** edizione preferita salvata, altrimenti quella della lingua dell'interfaccia */
  private defaultEdition(): string {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored && this.editions.some((e) => e.code === stored)) return stored;
    const ui = this.language.current();
    return this.editions.some((e) => e.code === ui) ? ui : 'en';
  }

  examples(): string[] {
    return EXAMPLES[this.lang()] ?? EXAMPLES['en'];
  }

  onLangChange(ev: Event): void {
    const code = (ev.target as HTMLSelectElement).value;
    this.lang.set(code);
    localStorage.setItem(LANG_KEY, code);
    this.suggestions.set([]);
    if (this.query()) this.search(this.query());
  }

  onQuery(ev: Event): void {
    const q = (ev.target as HTMLInputElement).value;
    this.query.set(q);
    clearTimeout(this.debounce);
    if (!q.trim()) {
      this.suggestions.set([]);
      return;
    }
    this.debounce = setTimeout(() => this.search(q), 250);
  }

  private async search(q: string): Promise<void> {
    this.searchAbort?.abort();
    const ac = new AbortController();
    this.searchAbort = ac;
    try {
      const titles = await this.api.searchTitles(this.lang(), q, ac.signal);
      if (!ac.signal.aborted) this.suggestions.set(titles);
    } catch {
      /* richiesta annullata o fallita: ignora */
    }
  }

  submit(): void {
    const first = this.suggestions()[0];
    this.go(first ?? this.query());
  }

  go(title: string): void {
    const clean = title.trim();
    if (!clean) return;
    this.router.navigate(['/', this.lang(), clean]);
  }
}
