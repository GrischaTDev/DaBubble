import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-card',
  standalone: true,
  imports: [
    MatIconModule,
    RouterModule
  ],
  templateUrl: './register-card.component.html',
  styleUrl: './register-card.component.scss'
})
export class RegisterCardComponent {

  constructor( private router: Router ) { }

saveRegister() {
  this.router.navigate(['/create-avatar']);
}

}
