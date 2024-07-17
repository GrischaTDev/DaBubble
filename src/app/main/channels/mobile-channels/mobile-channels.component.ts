import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MainServiceService } from '../../../service/main-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelComponent } from '../add-channel/add-channel.component';
import { Router } from '@angular/router';
import { ChatService } from '../../../service/chat.service';



@Component({
  selector: 'app-mobile-channels',
  standalone: true,
  imports: [CommonModule, MatIconModule, AddChannelComponent],
  templateUrl: './mobile-channels.component.html',
  styleUrl: './mobile-channels.component.scss'
})
export class MobileChannelsComponent  implements OnInit {
  private dialog = inject(MatDialog);

  constructor(public mainService: MainServiceService, private router: Router, public chatService: ChatService,) {}
  channelListOpen: boolean = true;
  userListOpen: boolean = true;
  currentUser = this.mainService.loggedInUser;
  arrowIconChannels: string = 'arrow_drop_down';
  arrowIconUser: string = 'arrow_drop_down';


  ngOnInit() {
    setTimeout(() => {
      this.currentUser = this.mainService.loggedInUser;
      console.log('Eingeloggter Benutzer', this.currentUser);
    }, 1000);
  }


  navigateToChat(userId: string) {
    this.router.navigate(['/direct-chat', userId]); 
  }


  openDialogAddChannel() {
    this.dialog.open(AddChannelComponent);
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
