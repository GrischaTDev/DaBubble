import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { LoginService } from '../../../service/login.service';
import { error } from 'console';

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

  selectedAvatarImage: string | ArrayBuffer | null = './assets/img/user/user1.svg';

  chooseAvatar(index: number) {
    this.selectedAvatarImage = this.avatarImg[index];
    console.log(this.selectedAvatarImage)
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          this.selectedAvatarImage = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  constructor(private router: Router, private firestore: Firestore, private loginService: LoginService, private ngZone: NgZone) { }

  async saveAndBackToLogin(event: Event) {

    if (event) {
      event.preventDefault();
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (user !== null) {

      this.loginService.setUserRegistered(true);

      try {
        await setDoc(doc(this.firestore, 'users', user.uid), {
          avatar: this.selectedAvatarImage
        }, { merge: true });

        console.log('Daten erfolgreich gespeichert.');

        // 2 Sekunden warten
        setTimeout(() => {
          this.router.navigate(['login']).then(() => {
            this.loginService.setUserRegistered(false);
          }).catch((navigationError) => {
            console.error("Error during navigation: ", navigationError);
          });
        }, 2000);
      } catch (error) {
        console.error("Error saving document: ", error);
      }



    }

  }

}