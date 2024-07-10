import { Component } from '@angular/core';
import { LoginCardComponent } from './../../shared/login-card/login-card.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-desktop-login',
  standalone: true,
  imports: [
    LoginCardComponent,
    RouterModule,
    CommonModule
  ],
  animations: [

  ],
  templateUrl: './desktop-login.component.html',
  styleUrl: './desktop-login.component.scss'
})
export class DesktopLoginComponent {

}
