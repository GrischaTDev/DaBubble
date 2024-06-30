import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from 'express';
import { LoginCardComponent } from './../../shared/login-card/login-card.component';

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

  email: string = '';
  password: string = '';

}
