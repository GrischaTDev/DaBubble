import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ChatService } from '../../../service/chat.service';
import { ChannelService } from '../../../service/channel.service';
import { CommonModule } from '@angular/common';
import { MainServiceService } from '../../../service/main-service.service';

@Component({
  selector: 'app-dialog-edit-channel',
  standalone: true,
  imports: [MatIconModule, FormsModule, CommonModule],
  templateUrl: './dialog-edit-channel.component.html',
  styleUrl: './dialog-edit-channel.component.scss'
})
export class DialogEditChannelComponent {
 
  constructor(
    public chatService: ChatService,
    public channelService: ChannelService,
    public mainService: MainServiceService
  ) {}
}
