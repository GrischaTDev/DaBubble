import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { MainServiceService } from '../../../service/main-service.service';
import { User } from '../../../../assets/models/user.class';
import { LoginService } from '../../../service/login.service';
import { Firestore } from '@angular/fire/firestore';
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

  constructor(public mainService: MainServiceService, private loginService: LoginService, private router: Router, private firestore: Firestore ) {
  }

  ngOnInit() {
    this.loginService.currentLoggedUser()
    this.loginService.loggedInUser$.subscribe((user) => {
      this.currentUser = user;
      console.log('Eingeloggter Benutzer Desktop Header', this.currentUser);
    });
  }


  private dialog = inject(MatDialog);
  userMenu: boolean = false;


  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    const target = event.target as HTMLElement;
    const triggerElement = document.querySelector('.user'); // Element, das openUserMenu() auslöst

    if (this.userMenu && target !== triggerElement) { // Nur schließen, wenn nicht auf triggerElement geklickt wurde
      const clickedInsideMenu = target.closest('.menu-container');
      if (!clickedInsideMenu) {
        this.userMenu = false;
      }
    }
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
