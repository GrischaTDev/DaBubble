import { CommonModule } from '@angular/common';
import { Component, HostListener, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MainServiceService } from '../../../service/main-service.service';
import { Channel } from '../../../../assets/models/channel.class';

@Component({
  selector: 'app-add-channel',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './add-channel.component.html',
  styleUrl: './add-channel.component.scss',
})
export class AddChannelComponent {
  addUserMenu: boolean = false;
  newChannelName: string = '';
  newChannelDescription: string = '';
  dataChannel: Channel = new Channel();

  constructor(
    public dialogRef: MatDialogRef<AddChannelComponent>,
    public mainService: MainServiceService
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  openAddUserMenu() {
    this.addUserMenu = !this.addUserMenu;
  }

  /**
   * Creates a new channel by setting the necessary properties and then adds it to Firestore under the 'channels' collection.
   * This function sets the channel's name and description based on class properties before creating a new Channel instance
   * and adding it to Firebase.
   */
  addChannel() {
    this.dataChannel.name = this.newChannelName;
    this.dataChannel.description = this.newChannelDescription;
    this.mainService.addNewDocOnFirebase(
      'channels',
      new Channel(this.dataChannel)
    );
  }
}
