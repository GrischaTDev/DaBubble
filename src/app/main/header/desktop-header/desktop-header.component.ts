import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { MainServiceService } from '../../../service/main-service.service';
import { LoginService } from '../../../service/login.service';
import { getAuth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-desktop-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, UserProfileComponent],
  templateUrl: './desktop-header.component.html',
  styleUrl: './desktop-header.component.scss'
})
export class DesktopHeaderComponent implements OnInit {
  currentUser: any;
  private dialog = inject(MatDialog);
  userMenu: boolean = false;

  constructor(public mainService: MainServiceService, private loginService: LoginService, private router: Router ) {}


  ngOnInit() {
    this.loginService.currentLoggedUser()
    this.loginService.loggedInUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }


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
  }
}
