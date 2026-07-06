import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { uiStrings } from './core/ui-strings';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly t = uiStrings();
}
