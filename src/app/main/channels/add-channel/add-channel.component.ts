import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-channel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './add-channel.component.html',
  styleUrl: './add-channel.component.scss'
})
export class AddChannelComponent {
  addUserMenu: boolean = false;

  constructor(public dialogRef: MatDialogRef<AddChannelComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }

  // @HostListener('document:click', ['$event'])
  // clickout(event: Event) {
  //   const target = event.target as HTMLElement;
  //   const triggerElement = document.querySelector('.add-user'); // Element, das openUserMenu() auslöst
  
  //   if (this.addUserMenu && target !== triggerElement) { // Nur schließen, wenn nicht auf triggerElement geklickt wurde
  //     const clickedInsideMenu = target.closest('.menu-container');
  //     if (!clickedInsideMenu) {
  //       this.addUserMenu = false;
  //     }
  //   }
  // }

  openAddUserMenu() {
    this.addUserMenu = !this.addUserMenu;
  }

}
