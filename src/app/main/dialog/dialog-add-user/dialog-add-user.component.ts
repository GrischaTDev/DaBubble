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
  selector: 'app-dialog-add-user',
  standalone: true,
  imports: [MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    CommonModule,
    MatIconModule,
    FormsModule],
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss'
})
export class DialogAddUserComponent {

  constructor(
    public chatService: ChatService,
    public mainService: MainServiceService
  ) {
    this.chatService = chatService;
  }

}
