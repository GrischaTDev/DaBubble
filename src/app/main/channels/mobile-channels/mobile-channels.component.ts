import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mobile-channels',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './mobile-channels.component.html',
  styleUrl: './mobile-channels.component.scss'
})
export class MobileChannelsComponent {
  channelListOpen: boolean = true;
  userListOpen: boolean = true;
  arrowIconChannels: string = 'arrow_drop_down';
  arrowIconUser: string = 'arrow_drop_down';

  openChannels() {
    this.channelListOpen = !this.channelListOpen;
    this.arrowIconChannels = this.arrowIconChannels === 'arrow_right' ? 'arrow_drop_down' : 'arrow_right';
  }

  openUserList() {
    this.userListOpen = !this.userListOpen;
    this.arrowIconUser = this.arrowIconUser === 'arrow_right' ? 'arrow_drop_down' : 'arrow_right';
  }
}
