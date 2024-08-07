import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MainServiceService } from '../../service/main-service.service';
import { UserProfileService } from '../../service/user-profile.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../../assets/models/user.class';
import { LoginService } from '../../service/login.service';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  loggedInUser: any;
  editProfileOpen: boolean = false;
  updateUserName: string = '';
  updateUserEmail: string = '';
  loggedInUserStatus: string = './assets/img/offline.svg';
  directUserProfileStatus: string = './assets/img/offline.svg';

  constructor(
    public dialogRef: MatDialogRef<UserProfileComponent>,
    public mainService: MainServiceService,
    public userProfileService: UserProfileService,
    private loginService: LoginService,
    @Inject(MAT_DIALOG_DATA) public directUserProfile: User 
  ) {}


  /**
   * Initializes the component.
   * - Retrieves the current logged user using the login service.
   * - Subscribes to the loggedInUser$ observable to get the logged in user.
   * - Sets the loggedInUser property to the retrieved user.
   * - Calls the checkUserStatus method.
   */
  ngOnInit() {
    this.loginService.currentLoggedUser()
    this.loginService.loggedInUser$.subscribe((user) => {
      this.loggedInUser = user;
    });
    this.checkUserStatus();
  }


  /**
   * Checks the status of the user and sets the appropriate status image paths.
   */
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


  /**
   * Closes the dialog.
   */
  closeDialog() {
    this.dialogRef.close();
  }


  /**
   * Prevents the event from propagating further.
   * 
   * @param event - The event object.
   */
  doNotClose(event: Event) {
    event.stopPropagation();
  }


  /**
   * Toggles the state of the editProfileOpen property.
   */
  editUserProfile() {
    this.editProfileOpen = !this.editProfileOpen;
  }


  /**
   * Updates the current user's profile.
   * 
   * @returns {Promise<void>} A promise that resolves when the user's profile is updated.
   */
  async updateCurrentUser() {
    let name =  this.updateUserName;
    let email =  this.updateUserEmail;
    await this.userProfileService.updateUserProfile(name, email);
    this.loggedInUser = this.mainService.loggedInUser;

    setTimeout(() => {
      this.editProfileOpen = false;
      this.userProfileService.isEmailError = false;
      this.userProfileService.isEmailSend = false;
    }, 3000);
  }
}
