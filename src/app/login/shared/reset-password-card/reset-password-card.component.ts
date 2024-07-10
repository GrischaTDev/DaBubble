import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { LoginService } from '../../../service/login.service';

@Component({
  selector: 'app-reset-password-card',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './reset-password-card.component.html',
  styleUrl: './reset-password-card.component.scss'
})
export class ResetPasswordCardComponent {
email: string = '';

constructor(private firestore: Firestore, private loginService: LoginService) {}

resetPassword() {
  const auth = getAuth();
  console.log(this.email);
  sendPasswordResetEmail(auth, this.email)
  .then(() => {
    this.loginService.setResetPasswordOverlay(true);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
}

}
