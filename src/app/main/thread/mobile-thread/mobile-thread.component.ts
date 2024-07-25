import { Component } from '@angular/core';
import { MobileChatHeaderComponent } from '../../header/mobile-chat-header/mobile-chat-header.component';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../service/chat.service';

@Component({
  selector: 'app-mobile-thread',
  standalone: true,
  imports: [
    MobileChatHeaderComponent, 
    MatIcon,
    FormsModule,
  ],
  templateUrl: './mobile-thread.component.html',
  styleUrl: './mobile-thread.component.scss'
})
export class MobileThreadComponent {

  parmsId: string = '';

  constructor(public chatService: ChatService) {}

}
