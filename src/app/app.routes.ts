import { Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { MainComponent } from './main/main.component';
import { RegisterComponent } from './login/register/register.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'main', component: MainComponent },
];
