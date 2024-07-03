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
    './assets/img/user/user1.svg',
    './assets/img/user/user2.svg',
    './assets/img/user/user3.svg',
    './assets/img/user/user4.svg',
    './assets/img/user/user5.svg',
    './assets/img/user/user6.svg',
  ];

  selectedAvatarImage: string | null = './assets/img/user/user1.svg';

  chooseAvatar(index: number) {
    this.selectedAvatarImage = this.avatarImg[index];
    console.log(this.selectedAvatarImage)
  }

  constructor(private router: Router, private firestore: Firestore) { }

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
