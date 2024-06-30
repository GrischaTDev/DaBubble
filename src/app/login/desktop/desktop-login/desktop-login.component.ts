import { Component } from '@angular/core';
import { LoginCardComponent } from './../../shared/login-card/login-card.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-desktop-login',
  standalone: true,
  imports: [
    LoginCardComponent,
    RouterModule
  ],
  templateUrl: './desktop-login.component.html',
  styleUrl: './desktop-login.component.scss'
})
export class DesktopLoginComponent {

}
