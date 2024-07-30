import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MainServiceService } from '../../../service/main-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelComponent } from '../add-channel/add-channel.component';
import { Router } from '@angular/router';
import { ChatService } from '../../../service/chat.service';
import { NewMessageComponent } from '../../new-message/new-message.component';
import { LoginService } from '../../../service/login.service';
import { DirectMessageService } from '../../../service/direct-message.service';
import { DirectChatComponent } from '../../chat/direct-chat/direct-chat.component';
import { setTimeout } from 'timers/promises';
import { Subscription } from 'rxjs';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { Channel } from '../../../../assets/models/channel.class';



@Component({
  selector: 'app-desktop-channels',
  standalone: true,
  imports: [CommonModule, MatIconModule, AddChannelComponent, NewMessageComponent, DirectChatComponent],
  templateUrl: './desktop-channels.component.html',
  styleUrl: './desktop-channels.component.scss'
})
export class DesktopChannelsComponent implements OnInit {
  private dialog = inject(MatDialog);

  constructor( private firestore: Firestore, public mainService: MainServiceService, private loginService: LoginService, private router: Router, public chatService: ChatService, public directMessageService: DirectMessageService) { }
  channelListOpen: boolean = true;
  userListOpen: boolean = true;
  currentUser: any;
  arrowIconChannels: string = 'arrow_drop_down';
  arrowIconUser: string = 'arrow_drop_down';
  selectedChannel: any;
  private subscription: Subscription = new Subscription();
  private itemsSubscription?: Subscription;
  activeChannelId: string | null = null;


  ngOnInit() {
    this.loginService.currentLoggedUser()
    this.loginService.loggedInUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }


  openChannel(channel: any) {
    this.router.navigate(['/main', channel.id]);
    this.itemsSubscription?.unsubscribe();
    const docRef = doc(this.firestore, `channels/${channel.id}`);
    this.itemsSubscription = docData(docRef).subscribe(channel => {
      this.chatService.dataChannel = channel as Channel;
    });
    this.directMessageService.desktopChatOpen = true;
    this.directMessageService.directChatOpen = false;
    this.activeChannelId = channel.id;
  }

  openDirectChat(user: any) {
    this.directMessageService.desktopChatOpen = false;
    this.directMessageService.directChatOpen = true;
    console.log('Direct Chat User', user);
    this.chatService.clickedUser = user;
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

  /**
  * Sets the mobile chat status to open in the chat service.
  */
  setVariableOpenChat() {
    this.chatService.mobileChatIsOpen = true;
  }
}
