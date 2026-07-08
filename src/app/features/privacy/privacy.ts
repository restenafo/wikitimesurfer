import { Component, computed, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LanguageService } from '../../core/language.service';
import { uiStrings } from '../../core/ui-strings';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.html',
  styleUrl: './privacy.scss',
})
export class Privacy {
  private language = inject(LanguageService);
  private titleSrv = inject(Title);

  readonly t = computed(() => uiStrings(this.language.current()));
  /** la policy esiste in italiano e inglese; le altre lingue vedono l'inglese */
  readonly showItalian = computed(() => this.language.current() === 'it');

  constructor() {
    effect(() => this.titleSrv.setTitle(`${this.t().footerPrivacy} — ${this.t().appName}`));
  }
}
