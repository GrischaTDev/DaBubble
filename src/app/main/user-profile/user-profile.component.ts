import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MainServiceService } from '../../service/main-service.service';
import { UserProfileService } from '../../service/user-profile.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../../assets/models/user.class';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  loggedInUser = this.mainService.loggedInUser;
  editProfileOpen: boolean = false;
  updateUserName: string = '';
  updateUserEmail: string = '';
  loggedInUserStatus: string = './assets/img/offline.svg';
  directUserProfileStatus: string = './assets/img/offline.svg';

  constructor(
    public dialogRef: MatDialogRef<UserProfileComponent>,
    public mainService: MainServiceService,
    public userProfileService: UserProfileService,
    @Inject(MAT_DIALOG_DATA) public directUserProfile: User 
  ) {}


  ngOnInit() {
    this.mainService.currentLoggedUser();
    this.checkUserStatus();
  }


  checkUserStatus() {
    if(this.loggedInUser.online) {
      this.loggedInUserStatus = './assets/img/aktive.svg';
    } else {
      this.loggedInUserStatus = './assets/img/offline.svg';
    }
    if(this.directUserProfile?.online) {
      this.directUserProfileStatus = './assets/img/aktive.svg';
    } else {
      this.directUserProfileStatus = './assets/img/offline.svg';
    }
  }


  closeDialog() {
    this.dialogRef.close();
  }


  doNotClose(event: Event) {
    event.stopPropagation();
  }


  editUserProfile() {
    this.editProfileOpen = !this.editProfileOpen;
  }

  async updateCurrentUser() {
    let name =  this.updateUserName;
    let email =  this.updateUserEmail;
    await this.userProfileService.updateUserProfile(name, email);
    this.loggedInUser = this.mainService.loggedInUser;
    this.editProfileOpen = false;
  }
}
