import { Component, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { MainServiceService } from '../../../service/main-service.service';
import { LoginService } from '../../../service/login.service';
import { ChatService } from '../../../service/chat.service';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-desktop-thread',
  standalone: true,
  imports: [
    FormsModule,
    MatIcon
  ],
  templateUrl: './desktop-thread.component.html',
  styleUrl: './desktop-thread.component.scss'
})
export class DesktopThreadComponent {
  text: string = '';
  parmsId: string = '';

  constructor(public chatService: ChatService) {}

}
