import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MainServiceService } from '../../../service/main-service.service';
import { Channel } from '../../../../assets/models/channel.class';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChatService } from '../../../service/chat.service';
import { User } from '../../../../assets/models/user.class';


@Component({
  selector: 'app-add-channel',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './add-channel.component.html',
  styleUrl: './add-channel.component.scss',
})
export class AddChannelComponent implements OnInit{
  addUserMenu: boolean = false;
  isAddUserMenuOpen: boolean = false;
  addUserInput: boolean = false;
  newChannelName: string = '';
  newChannelDescription: string = '';
  dataChannel: Channel = new Channel();
  isDesktop: boolean = false;
  isThreadOpen: boolean = false;


  constructor(
    private breakpointObserver: BreakpointObserver,
    private chatService: ChatService,
    public dialogRef: MatDialogRef<AddChannelComponent>,
    public mainService: MainServiceService,
    public ChatService: ChatService
  ) {}


  closeDialog() {
    this.dialogRef.close();
    setTimeout(() => {
      this.isAddUserMenuOpen = false;
    }, 2000);
  }

  
  doNotClose(event: Event) {
    event.stopPropagation();
  }


  openAddUserMenu(event: Event) {
    event.stopPropagation();
    this.addUserMenu = !this.addUserMenu;
    if(this.isDesktop) {
      this.isAddUserMenuOpen = true;
    }
  }


  addUserInputfield() {
    this.addUserInput = !this.addUserInput;
  }


  addUserInputfieldOff() {
    this.addUserInput = false;
  }


  /**
   * Creates a new channel by setting the necessary properties and then adds it to Firestore under the 'channels' collection.
   * This function sets the channel's name and description based on class properties before creating a new Channel instance
   * and adding it to Firebase.
   */
  addChannel() {
    this.closeDialog();  
    this.dataChannel.name = this.newChannelName;
    this.dataChannel.description = this.newChannelDescription;
    this.dataChannel.messageToMe = false;   
    this.dataChannel.ownerUser.push(new User(this.mainService.loggedInUser));
    this.mainService.addNewDocOnFirebase(
      'channels',
      this.dataChannel
    );
    this.chatService.mobileChatIsOpen = true;
  }


  ngOnInit() {
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet
    ]).subscribe(result => {
      this.isDesktop = !result.matches; // Wenn es KEIN Handset oder Tablet ist, ist es Desktop
    });

    this.mainService.currentLoggedUser();
  }
}
