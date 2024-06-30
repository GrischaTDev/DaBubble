import { Component } from '@angular/core';
import { LoginCardComponent } from './../../shared/login-card/login-card.component';

@Component({
  selector: 'app-desktop-login',
  standalone: true,
  imports: [
    LoginCardComponent
  ],
  templateUrl: './desktop-login.component.html',
  styleUrl: './desktop-login.component.scss'
})
export class DesktopLoginComponent {

}
