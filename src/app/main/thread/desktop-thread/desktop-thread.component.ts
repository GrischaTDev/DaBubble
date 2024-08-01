import { Component, HostListener, inject, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { MainServiceService } from '../../../service/main-service.service';
import { LoginService } from '../../../service/login.service';
import { ChatService } from '../../../service/chat.service';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DialogEmojiComponent } from '../../dialog/dialog-emoji/dialog-emoji.component';
import { User } from '../../../../assets/models/user.class';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { DirectMessageService } from '../../../service/direct-message.service';
import { ChannelService } from '../../../service/channel.service';
import { CommonModule } from '@angular/common';
import { EmojiService } from '../../../service/emoji.service';

@Component({
  selector: 'app-desktop-thread',
  standalone: true,
  imports: [
    FormsModule,
    MatIcon,
    CommonModule
  ],
  templateUrl: './desktop-thread.component.html',
  styleUrl: './desktop-thread.component.scss'
})
export class DesktopThreadComponent {
  public dialog = inject(MatDialog);
  dialogInstance?: MatDialogRef<DialogEmojiComponent>;
  loggedInUser: User = new User();
  parmsId: string = '';

  constructor(
    private router: Router, private route: ActivatedRoute, public chatService: ChatService, public mainService: MainServiceService, public emojiService: EmojiService, public directMessageService: DirectMessageService, private loginService: LoginService, public channelService: ChannelService) {
  
  }

   /**
  * Initializes the component by fetching the current logged-in user and subscribing to changes in the user's status.
  * Upon receiving an update, it creates a new User instance and assigns it to a service for use within the application.
  * This is typically used to ensure that the component has access to the latest user information when it is initialized.
  */
   ngOnInit() {
    this.loginService.currentLoggedUser()
    this.loginService.loggedInUser$.subscribe((user) => {
      this.mainService.loggedInUser = new User(user);
    });
    this.checkScreenSize(window.innerWidth);
  }

   /**
  * Handles window resize events by checking if the screen size exceeds a specific width.
  * This method is triggered whenever the window is resized.
  */
   @HostListener('window:resize')
   onResize() {
     this.checkScreenSize(window.innerWidth);
   }
 
   /**
   * Redirects to the main page if the screen width exceeds 960 pixels.
   * @param {number} width - The current width of the screen.
   */
   private checkScreenSize(width: number) {
     if (width > 960) {
       this.router.navigate(['/main']);
       this.chatService.mobileChatIsOpen = true;
     } 
   }

  /**
* Opens a user profile in a modal dialog using Angular Material's Dialog component.
* The function configures the dialog to display details about a specified user.
* @param {User} directUser - The user whose profile is to be displayed in the dialog.
*/
  openUserProfile(directUser: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = directUser;
    this.dialog.open(UserProfileComponent, dialogConfig);
  }
}

