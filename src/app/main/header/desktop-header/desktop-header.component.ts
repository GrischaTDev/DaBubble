import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { MainServiceService } from '../../../service/main-service.service';
import { LoginService } from '../../../service/login.service';
import { getAuth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../../../../assets/models/user.class';
import { collection, doc, DocumentData, Firestore, onSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { DirectMessageService } from '../../../service/direct-message.service';
import { ChatService } from '../../../service/chat.service';
import { SearchFieldService } from '../../../search-field.service';


@Component({
  selector: 'app-desktop-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, UserProfileComponent, FormsModule],
  templateUrl: './desktop-header.component.html',
  styleUrl: './desktop-header.component.scss'
})
export class DesktopHeaderComponent implements OnInit {

  currentUser: any;
  private dialog = inject(MatDialog);
  userMenu: boolean = false;

  searchValue: string = '';


  constructor(public mainService: MainServiceService, private loginService: LoginService, private router: Router, private firestore: Firestore, private directMessageService: DirectMessageService, private chatService: ChatService, public searchField: SearchFieldService) {}


  ngOnInit() {
    this.loginService.currentLoggedUser()
    this.loginService.loggedInUser$.subscribe((user) => {
      this.currentUser = user;
      this.mainService.loggedInUser = new User(user);
    });
  }

  /**
   * 
   * Opens a direct chat for the user that is clicked on.
   * @param user - User that is clicked on.
   */
  openDirectChat(user: any) {
    this.directMessageService.desktopChatOpen = false;
    this.directMessageService.directChatOpen = true;
    this.chatService.clickedUser = user;

    this.searchValue = '';
  }

  /**
   * 
   * Opens a channel is clicked on.
   * @param channel - Channel that is clicked on
   */
  openChannel(channel: any) {
    this.directMessageService.desktopChatOpen = true;
    this.directMessageService.directChatOpen = false;
    
    this.chatService.dataChannel = channel;

    this.searchValue = '';
  }


  doNotClose(event: Event) {
    event.stopPropagation();
  }


  openUserMenu() {
    this.userMenu = !this.userMenu;
  }


  openUserProfile() {
    this.dialog.open(UserProfileComponent);
  }


  logout() {
    const auth = getAuth();
    this.loginService.logoutUser(auth);
  }
}
