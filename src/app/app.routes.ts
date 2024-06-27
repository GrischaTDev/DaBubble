import { Routes } from '@angular/router';
import { MobileLoginComponent } from './login/mobile-login/mobile-login.component';
import { MainComponent } from './main/main.component';

export const routes: Routes = [
    { path: '', component: MobileLoginComponent },
    { path: 'main', component: MainComponent },
    { path: 'mobile-channels', component: MainComponent },
];
