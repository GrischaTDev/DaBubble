import { Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { authGuard } from './auth.guard';
import { ImprintComponent } from './imprint/imprint.component';
import { PolicyComponent } from './policy/policy.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    loadComponent: () =>
      import('./login/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./login/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: 'new-password',
    loadComponent: () =>
      import('./login/new-pasword/new-pasword.component').then(
        (m) => m.NewPaswordComponent,
      ),
  },
  {
    path: 'verify-email',
    loadComponent: () =>
      import('./login/verify-email/verify-email.component').then(
        (m) => m.VerifyEmailComponent,
      ),
  },
  {
    path: 'create-avatar',
    loadComponent: () =>
      import('./login/avatar/avatar.component').then((m) => m.AvatarComponent),
  },
  {
    path: 'main/:nameOfContent/:id/:idUser/:idOfChat',
    loadComponent: () =>
      import('./main/main.component').then((m) => m.MainComponent),
    resolve: { auth: authGuard },
  },
  {
    path: 'thread/:id1/:id2',
    loadComponent: () =>
      import('./main/thread/mobile-thread/mobile-thread.component').then(
        (m) => m.MobileThreadComponent,
      ),
  },
  {
    path: 'user-profile',
    loadComponent: () =>
      import('./main/user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent,
      ),
    resolve: { auth: authGuard },
  },
  {
    path: 'chat/:id/:userId/:idOfChat',
    loadComponent: () =>
      import('./main/chat/mobile-chat/mobile-chat.component').then(
        (m) => m.MobileChatComponent,
      ),
    resolve: { auth: authGuard },
  },
  {
    path: 'direct-chat/:id/:userId/:idOfChat',
    loadComponent: () =>
      import('./main/chat/direct-chat/direct-chat.component').then(
        (m) => m.DirectChatComponent,
      ),
    resolve: { auth: authGuard },
  },
  { path: 'imprint', component: ImprintComponent },
  { path: 'policy', component: PolicyComponent },
];
