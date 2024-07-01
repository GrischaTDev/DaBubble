import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MainServiceService } from '../../../service/main-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelComponent } from '../add-channel/add-channel.component';


@Component({
  selector: 'app-mobile-channels',
  standalone: true,
  imports: [CommonModule, MatIconModule, AddChannelComponent],
  templateUrl: './mobile-channels.component.html',
  styleUrl: './mobile-channels.component.scss'
})
export class MobileChannelsComponent {
  private dialog = inject(MatDialog);

  constructor(public mainService: MainServiceService) {}
  channelListOpen: boolean = true;
  userListOpen: boolean = true;
  arrowIconChannels: string = 'arrow_drop_down';
  arrowIconUser: string = 'arrow_drop_down';

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
