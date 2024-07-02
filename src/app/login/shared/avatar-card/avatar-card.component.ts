import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-avatar-card',
  standalone: true,
  imports: [
    MatIcon,
    CommonModule,
    RouterLink,
    RouterModule
  ],
  templateUrl: './avatar-card.component.html',
  styleUrl: './avatar-card.component.scss'
})
export class AvatarCardComponent {

  avatarImg = [
    'user1.svg',
    'user2.svg',
    'user3.svg',
    'user4.svg',
    'user5.svg',
    'user6.svg',
  ];

  selectedAvatarImage: string | null = 'user1.svg';

  chooseAvatar(index: number) {
    this.selectedAvatarImage = this.avatarImg[index];
    console.log(this.selectedAvatarImage)
  }

  constructor(private router: Router, private firestore: Firestore, private ngZone: NgZone) { }

  async saveAndBackToLogin() {

    const auth = getAuth();  
    const user = auth.currentUser;
      if (user !== null) {
        setDoc(doc(this.firestore, 'users', user.uid), {
          avatar: this.selectedAvatarImage
        }, { merge: true });
      }
      
      this.router.navigate(['login']);
    } 
}
