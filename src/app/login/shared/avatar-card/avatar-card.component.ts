import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-avatar-card',
  standalone: true,
  imports: [
    MatIcon,
    CommonModule,
    RouterLink
  ],
  templateUrl: './avatar-card.component.html',
  styleUrl: './avatar-card.component.scss'
})
export class AvatarCardComponent {
onFileSelected($event: Event) {
throw new Error('Method not implemented.');
}

  selectedAvatarImage: number = 1;

  chooseAvatar(index: number) {
    this.selectedAvatarImage = (index + 1);
  }

  constructor( private router: Router ) { }

  saveAndBackToLogin() {
    this.router.navigate(['/login']);
  }
  
}
