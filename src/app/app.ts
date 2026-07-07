import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ThemeService } from './core/theme.service';
import { uiStrings } from './core/ui-strings';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly t = uiStrings();
  readonly theme = inject(ThemeService);

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
        return this.t.themeLight;
      case 'dark':
        return this.t.themeDark;
      default:
        return this.t.themeAuto;
    }
  }
}
