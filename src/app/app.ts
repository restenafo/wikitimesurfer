import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LanguageService, UiLang } from './core/language.service';
import { ThemeService } from './core/theme.service';
import { uiStrings } from './core/ui-strings';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly theme = inject(ThemeService);
  readonly language = inject(LanguageService);

  readonly t = computed(() => uiStrings(this.language.current()));

  readonly uiLangs: { code: UiLang; label: string }[] = [
    { code: 'it', label: 'Italiano' },
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
  ];

  onUiLangChange(ev: Event): void {
    this.language.set((ev.target as HTMLSelectElement).value as UiLang);
  }

  themeIcon(): string {
    switch (this.theme.mode()) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      default:
        return '🌗';
    }
  }

  themeLabel(): string {
    switch (this.theme.mode()) {
      case 'light':
        return this.t().themeLight;
      case 'dark':
        return this.t().themeDark;
      default:
        return this.t().themeAuto;
    }
  }
}
