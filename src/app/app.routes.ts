import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Privacy } from './features/privacy/privacy';
import { Viewer } from './features/viewer/viewer';

// i titoli delle pagine sono impostati dai componenti nella lingua dell'interfaccia
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'privacy', component: Privacy },
  { path: ':lang/:title', component: Viewer },
  { path: '**', redirectTo: '' },
];
