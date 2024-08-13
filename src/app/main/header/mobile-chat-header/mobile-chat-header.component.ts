import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { MainServiceService } from '../../../service/main-service.service';
import { getAuth, signOut } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { LoginService } from '../../../service/login.service';
import { Router } from '@angular/router';
import { User } from '../../../../assets/models/user.class';
import { ChatService } from '../../../service/chat.service';
import { ThreadService } from '../../../service/thread.service';

@Component({
  selector: 'app-mobile-chat-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, UserProfileComponent],
  templateUrl: './mobile-chat-header.component.html',
  styleUrl: './mobile-chat-header.component.scss',
})
export class MobileChatHeaderComponent implements OnInit {
  constructor(
    public mainService: MainServiceService,
    private loginService: LoginService,
    private router: Router,
    public chatService: ChatService,
    public threadService: ThreadService
  ) {}
  currentUser: any;

  /**
   * Initializes the component.
   * Retrieves the current logged-in user and sets it as the current user.
   */
  ngOnInit() {
    this.loginService.currentLoggedUser();
    this.loginService.loggedInUser$.subscribe((user) => {
      this.currentUser = user;
      this.mainService.loggedInUser = new User(user);
    });
  }

  private dialog = inject(MatDialog);
  userMenu: boolean = false;

  /**
   * Prevents the event from propagating further.
   *
   * @param event - The event object.
   */
  doNotClose(event: Event) {
    event.stopPropagation();
  }

  /**
   * Toggles the user menu.
   */
  openUserMenu() {
    this.userMenu = !this.userMenu;
  }

  /**
   * Opens the user profile dialog.
   */
  openUserProfile() {
    this.dialog.open(UserProfileComponent);
  }

  /**
   * Logs out the user.
   *
   * @remarks
   * This method logs out the user by calling the `logoutUser` method of the `loginService` and then navigating to the login page.
   */
  logout() {
    this.threadService.closeThread();
    const auth = getAuth();
    this.loginService.logoutUser(auth);

    signOut(auth).then(() => {
      this.router.navigate(['login']);
    });
  }

  /**
   * Closes the mobile chat.
   * Navigates to the main page with the current data channel ID.
   * Sets the mobileChatIsOpen and mobileDirectChatIsOpen properties of the chatService to false.
   */
  closeMobileChat() {
    this.router.navigate(['/main', 'chat', this.chatService.dataChannel.id, 'user']);
    this.chatService.mobileChatIsOpen = false;
    this.chatService.mobileDirectChatIsOpen = false;
  }
}
