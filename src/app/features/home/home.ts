import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
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

  readonly t = uiStrings();
  readonly editions = this.api.editions;

  lang = signal(localStorage.getItem(LANG_KEY) ?? 'it');
  query = signal('');
  suggestions = signal<string[]>([]);

  private debounce?: ReturnType<typeof setTimeout>;
  private searchAbort?: AbortController;

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
