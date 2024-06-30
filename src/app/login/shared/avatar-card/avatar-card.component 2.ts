import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

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
  
}
