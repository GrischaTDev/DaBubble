import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { MainServiceService } from '../../service/main-service.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  currentUser = this.mainService.loggedInUser;
  editProfileOpen: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UserProfileComponent>,
    public mainService: MainServiceService
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
}
