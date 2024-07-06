import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, UserProfileComponent],
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.scss'] 
})
export class MobileHeaderComponent {
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
