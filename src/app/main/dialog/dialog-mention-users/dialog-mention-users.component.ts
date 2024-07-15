import { Component } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ChatService } from '../../../service/chat.service';
import { User } from '../../../../assets/models/user.class';
import { MainServiceService } from '../../../service/main-service.service';

@Component({
  selector: 'app-dialog-mention-users',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    CommonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './dialog-mention-users.component.html',
  styleUrl: './dialog-mention-users.component.scss',
})
export class DialogMentionUsersComponent {
  loggedInUserId = '4m4EZCAqmNAl0EwzHTgG';

  inputContent = '';

  constructor(
    public chatService: ChatService,
    public mainService: MainServiceService
  ) {
    this.chatService = chatService;
  }

  addMentionUser(user: User) {
    /* this.chatService.mentionUser.push(new User(user)); */
    this.inputContent = ' ' + '@' + user.name;
    this.mainService.changeInputContent(this.inputContent);
  }
}
