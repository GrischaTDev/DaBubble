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
import { SearchFieldService } from '../../../search-field.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-mobile-channels',
  standalone: true,
  imports: [CommonModule, MatIconModule, AddChannelComponent, NewMessageComponent, FormsModule],
  templateUrl: './mobile-channels.component.html',
  styleUrl: './mobile-channels.component.scss'
})
export class MobileChannelsComponent  implements OnInit {
  private dialog = inject(MatDialog);

  constructor(public mainService: MainServiceService, private loginService: LoginService, private router: Router, public chatService: ChatService, public directMessageService: DirectMessageService, public searchField: SearchFieldService) {}
  channelListOpen: boolean = true;
  userListOpen: boolean = true;
  currentUser: any;
  arrowIconChannels: string = 'arrow_drop_down';
  arrowIconUser: string = 'arrow_drop_down';

  searchValue: string = '';


  ngOnInit() {
    this.loginService.currentLoggedUser()
    this.loginService.loggedInUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  navigateToChat(userId: string) {
    this.router.navigate(['/direct-chat', userId]); 
  }

  openDialogAddChannel() {
    this.dialog.open(AddChannelComponent);
  }

  openDialogNewMessage() {
    this.dialog.open(NewMessageComponent);
  }

  openChannels() {
    this.channelListOpen = !this.channelListOpen;
    this.arrowIconChannels = this.arrowIconChannels === 'arrow_right' ? 'arrow_drop_down' : 'arrow_right';
  }

  openUserList() {
    this.userListOpen = !this.userListOpen;
    this.arrowIconUser = this.arrowIconUser === 'arrow_right' ? 'arrow_drop_down' : 'arrow_right';
  }

  openDirectChat(user: any) {
    this.chatService.desktopChatOpen = false;
    this.chatService.directChatOpen = true;
    this.chatService.clickedUser = user;
    this.searchValue = '';
  }

  /**
   * 
   * Opens a channel is clicked on.
   * @param channel - Channel that is clicked on
   */
  openChannel(channel: any) {
    this.chatService.desktopChatOpen = true;
    this.chatService.directChatOpen = false;  
    this.chatService.dataChannel = channel;
    this.searchValue = '';
    this.chatService.mobileChatIsOpen = true;
    this.chatService.mobileDirectChatIsOpen = false;
  }
}
