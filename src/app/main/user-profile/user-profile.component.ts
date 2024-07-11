import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { MainServiceService } from '../../service/main-service.service';
import { UserProfileService } from '../../service/user-profile.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  currentUser = this.mainService.loggedInUser;
  editProfileOpen: boolean = false;
  updateUserName: string = '';
  updateUserEmail: string = '';

  constructor(
    public dialogRef: MatDialogRef<UserProfileComponent>,
    public mainService: MainServiceService,
    public userProfileService: UserProfileService 
  ) {}


  ngOnInit() {
    this.mainService.currentLoggedUser();
    console.log('User Profile', this.currentUser);
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
    this.currentUser = this.mainService.loggedInUser;
    this.editProfileOpen = false;
  }
}
