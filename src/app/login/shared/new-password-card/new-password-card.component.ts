import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-password-card',
  standalone: true,
  imports: [RouterLink, MatIcon],
  templateUrl: './new-password-card.component.html',
  styleUrl: './new-password-card.component.scss'
})
export class NewPasswordCardComponent {
changePassword() {
throw new Error('Method not implemented.');
}

}
