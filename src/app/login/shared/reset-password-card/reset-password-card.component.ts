import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password-card',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink
  ],
  templateUrl: './reset-password-card.component.html',
  styleUrl: './reset-password-card.component.scss'
})
export class ResetPasswordCardComponent {
resetPassword() {
throw new Error('Method not implemented.');
}

}
