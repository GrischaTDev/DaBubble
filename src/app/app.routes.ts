import { Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { MainComponent } from './main/main.component';
import { RegisterComponent } from './login/register/register.component';
import { MobileChatComponent } from './main/chat/mobile-chat/mobile-chat.component';
import { AvatarComponent } from './login/avatar/avatar.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { NewPaswordComponent } from './login/new-pasword/new-pasword.component';
import { DirectChatComponent } from './main/chat/direct-chat/direct-chat.component';
import { VerifyEmailComponent } from './login/verify-email/verify-email.component';
import { UserProfileComponent } from './main/user-profile/user-profile.component';
import { MobileThreadComponent } from './main/thread/mobile-thread/mobile-thread.component';
import { DesktopThreadComponent } from './main/thread/desktop-thread/desktop-thread.component';
import { authGuard } from './auth.guard';


export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'new-password', component: NewPaswordComponent },
    { path: 'verify-email', component: VerifyEmailComponent },
    { path: 'create-avatar', component: AvatarComponent },
    { path: 'main/:id', component: MainComponent, resolve: {auth: authGuard} },
    { path: 'thread', component: MobileThreadComponent },
    { path: 'user-profile', component: UserProfileComponent, resolve: {auth: authGuard} },
    { path: 'chat/:id', component: MobileChatComponent, resolve: {auth: authGuard} },
    { path: 'direct-chat/:userId', component: DirectChatComponent, resolve: {auth: authGuard} },
];
