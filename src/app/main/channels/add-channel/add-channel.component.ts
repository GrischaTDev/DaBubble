import { CommonModule } from '@angular/common';
import { Component, HostListener, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-channel',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './add-channel.component.html',
  styleUrl: './add-channel.component.scss'
})
export class AddChannelComponent {
  addUserMenu: boolean = false;
  newChannelName: string = '';

  constructor(public dialogRef: MatDialogRef<AddChannelComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }

  openAddUserMenu() {
    this.addUserMenu = !this.addUserMenu;
  }

  addChannel() {
    console.log('Wert 1:', this.newChannelName);
  }

}
