import { Component } from '@angular/core';
import { ChatService } from '../../../service/chat.service';
import { MainServiceService } from '../../../service/main-service.service';
import { EmojiService } from '../../../service/emoji.service';
import { NewMessageService } from '../../../service/new-message.service';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog-search-channels',
  standalone: true,
  imports: [MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    CommonModule,
    MatIconModule,
    FormsModule,],
  templateUrl: './dialog-search-channels.component.html',
  styleUrl: './dialog-search-channels.component.scss'
})
export class DialogSearchChannelsComponent {
  constructor(
    public chatService: ChatService,
    public mainService: MainServiceService,
    public emojiService: EmojiService,
    public newMessageService: NewMessageService,
  ) {

  }
}
