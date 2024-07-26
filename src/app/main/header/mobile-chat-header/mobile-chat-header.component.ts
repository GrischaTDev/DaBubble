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
import { User } from '../../../../assets/models/user.class';

@Component({
  selector: 'app-mobile-chat-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, UserProfileComponent],
  templateUrl: './mobile-chat-header.component.html',
  styleUrl: './mobile-chat-header.component.scss'
})
export class MobileChatHeaderComponent implements OnInit {
  constructor(public mainService: MainServiceService, private firestore: Firestore, private loginService: LoginService, private router: Router) {}
  currentUser: any;

  ngOnInit() {
    this.loginService.currentLoggedUser()
    this.loginService.loggedInUser$.subscribe((user) => {
      this.currentUser = user;
      this.mainService.loggedInUser = new User(user);
    });
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
