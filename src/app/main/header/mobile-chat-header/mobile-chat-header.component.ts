import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { MainServiceService } from '../../../service/main-service.service';
import { getAuth, signOut } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { LoginService } from '../../../service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-chat-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, UserProfileComponent],
  templateUrl: './mobile-chat-header.component.html',
  styleUrl: './mobile-chat-header.component.scss'
})
export class MobileChatHeaderComponent implements OnInit {
  constructor(public mainService: MainServiceService, private firestore: Firestore, private loginService: LoginService, private router: Router) {}
  currentUser = this.mainService.loggedInUser;

  ngOnInit() {
    this.mainService.currentLoggedUser();
    console.log('Logged in user', this.currentUser);
    console.log('User avatar', this.currentUser.avatar);
  }

  
  private dialog = inject(MatDialog);
  userMenu: boolean = false;


  doNotClose(event: Event) {
    event.stopPropagation();
  }

  openUserMenu() {
    this.userMenu = !this.userMenu;
  }


  openUserProfile() {
    this.dialog.open(UserProfileComponent);
  }

  logout() {
    const auth = getAuth();
    this.loginService.logoutUser(auth);

    signOut(auth).then(() => {
      this.router.navigate(['login']);
    })
  }
}
