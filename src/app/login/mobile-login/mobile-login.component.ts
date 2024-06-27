import { Component } from '@angular/core';

@Component({
  selector: 'app-mobile-login',
  standalone: true,
  imports: [],
  templateUrl: './mobile-login.component.html',
  styleUrl: './mobile-login.component.scss'
})
export class MobileLoginComponent {

  email: string = '';
  password: string = '';

}
