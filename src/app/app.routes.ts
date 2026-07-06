import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Privacy } from './features/privacy/privacy';
import { Viewer } from './features/viewer/viewer';

export const routes: Routes = [
  { path: '', component: Home, title: 'WikiTimeSurfer — naviga la storia delle voci di Wikipedia' },
  { path: 'privacy', component: Privacy, title: 'Privacy & Cookie — WikiTimeSurfer' },
  { path: ':lang/:title', component: Viewer },
  { path: '**', redirectTo: '' },
];
