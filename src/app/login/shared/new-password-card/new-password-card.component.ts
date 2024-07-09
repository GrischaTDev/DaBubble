import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { confirmPasswordReset, getAuth, updatePassword } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-password-card',
  standalone: true,
  imports: [RouterLink, MatIcon, FormsModule, CommonModule],
  templateUrl: './new-password-card.component.html',
  styleUrl: './new-password-card.component.scss'
})
export class NewPasswordCardComponent {

  oobCode: string | undefined;
  password: string = '';
  verifyPassword: string = '';
  errorMessage: string | undefined;

  constructor(private firetore: Firestore, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.oobCode = params['oobCode'];
    });
  }

  changePassword() {

    const auth = getAuth();

    if (this.oobCode && this.password) {
      confirmPasswordReset(auth, this.oobCode, this.password)
        .then(() => {
          console.log('Passwort wurde erfolgreich geändert.')
          this.router.navigate(['login']);
        })
        .catch((error) => {
          if(error.code === 'auth/expired-action-code') {
            this.errorMessage = 'Der Link zum Zurücksetzen des Passworts ist abgelaufen.'
          } else if(error.code === 'auth/invalid-action-code') {
            this.errorMessage = 'Der Link zum Zurücksetzen des Passworts ist ungültig. Bitte fordere eine neue E-Mail an.'
          }
        })
    };

  }

}
