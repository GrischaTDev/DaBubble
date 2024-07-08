import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { MainServiceService } from '../../../service/main-service.service';

@Component({
  selector: 'app-desktop-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, UserProfileComponent],
  templateUrl: './desktop-header.component.html',
  styleUrl: './desktop-header.component.scss'
})
export class DesktopHeaderComponent implements OnInit {
  constructor(public mainService: MainServiceService) {}
  currentUser = this.mainService.loggedInUser;

  ngOnInit() {
    this.mainService.currentLoggedUser();
    console.log('Logged in user', this.currentUser);
    console.log('User avatar', this.currentUser.avatar);
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

  }
}
