import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import { MainServiceService } from './main-service.service';
import { Channel } from '../../assets/models/channel.class';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  constructor(public chatService: ChatService, public mainService: MainServiceService) { }

    /**
 * Closes the currently open thread by setting `isThreadOpen` to false.
 * @function closeThread
 */
    closeThread() {
      this.chatService.isThreadOpen = false;
    }
  
    /**
   * Asynchronously sends a message from a specific channel, updating the channel data and triggering
   * a sendMessage process.
   * @param {string} channelId - The ID of the channel from which to send the message.
   * @param {string} textContent - The text content of the message.
   */
    async sendMessageFromThread(channelId: string, textContent: string) {
      this.chatService.messageThread.message = textContent;
      this.chatService.messageThread.date = Date.now();
      this.chatService.messageThread.userId = this.mainService.loggedInUser.id;
      this.chatService.messageThread.userName = this.mainService.loggedInUser.name;
      this.chatService.messageThread.userEmail = this.mainService.loggedInUser.email;
      this.chatService.messageThread.userAvatar = this.mainService.loggedInUser.avatar;
      this.chatService.messageThread.image = this.chatService.imageMessage;
      this.chatService.dataThread.messageChannel.push(this.chatService.messageThread);
      this.sendMessageToThread('threads', channelId);
      this.chatService.text = '';
    }
  
    /**
  * Initiates the process to add a new document for a message within a specified channel.
  * @param {string} docName - The name of the document to be added.
  * @param {string} channelId - The ID of the channel where the document should be added.
  */
    sendMessageToThread(docName: string, channelId: string) {
      this.mainService.addDoc(docName, this.chatService.dataThread.id, new Channel(this.chatService.dataThread));
    }
}