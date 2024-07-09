import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

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

constructor(private firestore: Firestore) {}

resetPassword() {
  const auth = getAuth();
  sendPasswordResetEmail(auth, this.email)
  .then(() => {
    console.log('Password reset email sent');
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
}

}
