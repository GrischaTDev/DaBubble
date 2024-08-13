import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MainServiceService } from '../../../service/main-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelComponent } from '../add-channel/add-channel.component';
import { Router } from '@angular/router';
import { ChatService } from '../../../service/chat.service';
import { NewMessageComponent } from '../../new-message/mobile-new-message/new-message.component';
import { LoginService } from '../../../service/login.service';
import { DirectMessageService } from '../../../service/direct-message.service';
import { DirectChatComponent } from '../../chat/direct-chat/direct-chat.component';
import { Subscription } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { Channel } from '../../../../assets/models/channel.class';
import { User } from '../../../../assets/models/user.class';
import { ThreadService } from '../../../service/thread.service';

@Component({
  selector: 'app-desktop-channels',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    AddChannelComponent,
    NewMessageComponent,
    DirectChatComponent,
  ],
  templateUrl: './desktop-channels.component.html',
  styleUrl: './desktop-channels.component.scss',
})
export class DesktopChannelsComponent implements OnInit {
  private dialog = inject(MatDialog);
  private subscription: Subscription = new Subscription();
  private itemsSubscription?: Subscription;
  channelListOpen: boolean = true;
  userListOpen: boolean = true;
  currentUser: any;
  arrowIconChannels: string = 'arrow_drop_down';
  arrowIconUser: string = 'arrow_drop_down';
  selectedChannel: any;
  activeChannelId: string | null = null;

  constructor(
    private firestore: Firestore,
    public mainService: MainServiceService,
    private loginService: LoginService,
    private router: Router,
    public chatService: ChatService,
    public directMessageService: DirectMessageService,
    public threadService: ThreadService
  ) {}

  /**
   * Initializes the component and sets up necessary subscriptions.
   */
  ngOnInit() {
    this.loginService.currentLoggedUser();
    this.loginService.loggedInUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  /**
   * Opens a specific channel and sets the necessary properties and routes.
   * @param {any} channel - The channel to open.
   */
  openChannel(channel: any) {
    this.threadService.closeThread();
    this.router.navigate(['/main','chat', channel.id, 'user']);
    this.mainService.watchSingleChannelDoc(channel.id, 'channels').subscribe((dataChannel) => {this.chatService.dataChannel = dataChannel as Channel;});
    this.chatService.mobileChatIsOpen = true;
    this.chatService.mobileDirectChatIsOpen = false;
    this.chatService.desktopChatOpen = true;
    this.chatService.directChatOpen = false;
    this.chatService.newMessageOpen = false;
    this.activeChannelId = channel.id;
    this.chatService.activateChatFocus();
  }

  /**
   * Opens a direct chat with a specific user.
   * @param {User} user - The user to open a direct chat with.
   */
  async openDirectChat(user: User) {
    this.chatService.clickedUser.id = user.id;
    this.chatService.clickedUser = user;
    await this.directMessageService.directMessageIsAvailable();
    this.directMessageService.directMessageDocId = this.mainService.docId;
    this.chatService.activateChatFocus();
  }

  /**
   * Opens the new message interface.
   */
  openNewMessage() {
    this.chatService.desktopChatOpen = false;
    this.chatService.directChatOpen = false;
    this.chatService.newMessageOpen = true;
  }

  /**
   * Navigates to the direct chat with a specific user.
   * @param {string} userId - The ID of the user to chat with.
   */
  navigateToChat(userId: string) {
    this.router.navigate(['/direct-chat', userId]);
  }

  /**
   * Opens the dialog to add a new channel.
   */
  openDialogAddChannel() {
    this.dialog.open(AddChannelComponent);
  }

  /**
   * Toggles the visibility of the channel list and updates the arrow icon.
   */
  openChannels() {
    this.channelListOpen = !this.channelListOpen;
    this.arrowIconChannels =
      this.arrowIconChannels === 'arrow_right' ? 'arrow_drop_down' : 'arrow_right';
  }

  /**
   * Toggles the visibility of the user list and updates the arrow icon.
   */
  openUserList() {
    this.userListOpen = !this.userListOpen;
    this.arrowIconUser =
      this.arrowIconUser === 'arrow_right' ? 'arrow_drop_down' : 'arrow_right';
  }

  /**
   * Sets the mobile chat status to open in the chat service.
   */
  setVariableOpenChat() {
    this.chatService.mobileChatIsOpen = true;
  }
}
