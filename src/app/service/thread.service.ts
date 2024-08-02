import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  constructor(public chatService: ChatService) { }

  closeThread() {
    this.chatService.isThreadOpen = false;
  }
}
