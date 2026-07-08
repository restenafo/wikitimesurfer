import { Injectable, effect, signal } from '@angular/core';

export type UiLang = 'it' | 'en' | 'de' | 'fr' | 'es';

const UI_LANG_KEY = 'wts.uilang';

function isUiLang(v: unknown): v is UiLang {
  return v === 'it' || v === 'en' || v === 'de' || v === 'fr' || v === 'es';
}

/**
 * Lingua iniziale: preferenza salvata, altrimenti la lingua del
 * browser/sistema, con l'inglese come fallback.
 */
function detectLang(): UiLang {
  const stored = localStorage.getItem(UI_LANG_KEY);
  if (isUiLang(stored)) return stored;
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const cand of candidates) {
    const code = cand?.slice(0, 2).toLowerCase();
    if (isUiLang(code)) return code;
  }
  return 'en';
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly current = signal<UiLang>(detectLang());

  constructor() {
    effect(() => {
      const lang = this.current();
      localStorage.setItem(UI_LANG_KEY, lang);
      document.documentElement.lang = lang;
    });
  }

  set(lang: UiLang): void {
    this.current.set(lang);
  }
}
