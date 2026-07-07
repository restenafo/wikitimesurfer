import { Injectable, computed, effect, signal } from '@angular/core';

export type ThemeMode = 'auto' | 'light' | 'dark';

const THEME_KEY = 'wts.theme';

function readStoredMode(): ThemeMode {
  const v = localStorage.getItem(THEME_KEY);
  return v === 'light' || v === 'dark' || v === 'auto' ? v : 'auto';
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** preferenza dell'utente (auto = segue il sistema) */
  readonly mode = signal<ThemeMode>(readStoredMode());

  private systemDark = signal(false);

  /** tema effettivamente applicato */
  readonly applied = computed<'light' | 'dark'>(() =>
    this.mode() === 'auto' ? (this.systemDark() ? 'dark' : 'light') : (this.mode() as 'light' | 'dark'),
  );

  constructor() {
    // matchMedia può mancare negli ambienti di test (jsdom)
    if (typeof window.matchMedia === 'function') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemDark.set(media.matches);
      media.addEventListener('change', (e) => this.systemDark.set(e.matches));
    }
    effect(() => {
      document.documentElement.dataset['theme'] = this.applied();
    });
    effect(() => {
      localStorage.setItem(THEME_KEY, this.mode());
    });
  }

  /** cicla auto → chiaro → scuro → auto */
  cycle(): void {
    const m = this.mode();
    this.mode.set(m === 'auto' ? 'light' : m === 'light' ? 'dark' : 'auto');
  }
}
