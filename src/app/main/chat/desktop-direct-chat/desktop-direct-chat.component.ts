import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MainServiceService } from '../../../service/main-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ChatService } from '../../../service/chat.service';
import { NewMessageComponent } from '../../new-message/new-message.component';
import { LoginService } from '../../../service/login.service';
import { DirectMessageService } from '../../../service/direct-message.service';
import { AddChannelComponent } from '../../channels/add-channel/add-channel.component';

@Component({
  selector: 'app-desktop-direct-chat',
  standalone: true,
  imports: [CommonModule, MatIconModule, AddChannelComponent, NewMessageComponent],
  templateUrl: './desktop-direct-chat.component.html',
  styleUrl: './desktop-direct-chat.component.scss'
})
export class DesktopDirectChatComponent implements OnInit {
  private dialog = inject(MatDialog);

  constructor(public mainService: MainServiceService, private loginService: LoginService, private router: Router, public chatService: ChatService, public directMessageService: DirectMessageService) {}
  channelListOpen: boolean = true;
  userListOpen: boolean = true;
  currentUser: any;
  arrowIconChannels: string = 'arrow_drop_down';
  arrowIconUser: string = 'arrow_drop_down';


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
}

