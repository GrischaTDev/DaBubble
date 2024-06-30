import { Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { MainComponent } from './main/main.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'main', component: MainComponent },
];
