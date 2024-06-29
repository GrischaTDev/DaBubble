import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mobile-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.scss'] 
})
export class MobileHeaderComponent {
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
}
