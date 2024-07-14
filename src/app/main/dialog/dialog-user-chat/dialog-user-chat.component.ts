import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { MainServiceService } from '../../../service/main-service.service';
import { UserProfileService } from '../../../service/user-profile.service';
import { ChatService } from '../../../service/chat.service';

@Component({
  selector: 'app-dialog-user-chat',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './dialog-user-chat.component.html',
  styleUrl: './dialog-user-chat.component.scss'
})

export class DialogUserChatComponent {
   currentUser = this.mainService.loggedInUser;
  editProfileOpen: boolean = false;
  updateUserName: string = '';
  updateUserEmail: string = '';
  userStatus: string = './assets/img/offline.svg';
  
    constructor(
      public dialogRef: MatDialogRef<UserProfileComponent>,
      public mainService: MainServiceService,
      public chatService: ChatService,
      public userProfileService: UserProfileService 
    ) {}
  
  
    ngOnInit() {
      this.mainService.currentLoggedUser();
      this.checkUserStatus();
       this.mainService.dialogClose = true;
    }
  
  
    checkUserStatus() {
      if(this.currentUser.online) {
        this.userStatus = './assets/img/aktive.svg';
      } else {
        this.userStatus = './assets/img/offline.svg';
      }
    }
  
  
    closeDialog() {
      if (this.mainService.dialogClose) {
        this.dialogRef.close();
      } 
    }

    editUserProfile() {
      this.editProfileOpen = !this.editProfileOpen;
    }
  
    async updateCurrentUser() {
      let name =  this.updateUserName;
      let email =  this.updateUserEmail;
      await this.userProfileService.updateUserProfile(name, email);
      this.currentUser = this.mainService.loggedInUser;
      this.editProfileOpen = false;
    }
  }
  



