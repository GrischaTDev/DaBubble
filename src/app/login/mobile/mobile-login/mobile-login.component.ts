import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginCardComponent } from './../../shared/login-card/login-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-login',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    LoginCardComponent,
  ],
  templateUrl: './mobile-login.component.html',
  styleUrl: './mobile-login.component.scss'
})
export class MobileLoginComponent {

  constructor(private router: Router) { }

routeToRegister() {
  this.router.navigate(['/register']);
}

  email: string = '';
  password: string = '';

}
