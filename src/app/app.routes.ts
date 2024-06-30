import { Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { MainComponent } from './main/main.component';
import { RegisterComponent } from './login/register/register.component';
import { MobileChatComponent } from './main/chat/mobile-chat/mobile-chat.component';
import { AvatarComponent } from './login/avatar/avatar.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'create-avatar', component: AvatarComponent },
    { path: 'main', component: MainComponent },
    { path: 'chat', component: MobileChatComponent },
];
