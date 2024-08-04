import { HostListener, Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import { MainServiceService } from './main-service.service';
import { Channel } from '../../assets/models/channel.class';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {
  textThread: string = '';
  activeThreadMessageIndex: number | null = null;
  editTextThread: string = '';
  editOpenThread: boolean = false;
  editMessageIndexThread: number | null = null;
  editMessageInputIndexThread: number | null = null;

  constructor(public chatService: ChatService, public mainService: MainServiceService) { }

  /**
  * Closes the currently open thread by setting `isThreadOpen` to false.
  * @function closeThread
  */
  closeThread() {
    this.chatService.isThreadOpen = false;
  }

  /**
  * Toggles the icon container based on the given index and event. Stops the event propagation if `editOpen` is false.
  * If the active message index matches the provided index, it closes the icon container; otherwise, it sets the active message index to the provided index.
  */
  toggleIconContainerThread(index: number, event: MouseEvent): void {
    if (!this.editOpenThread) {
      event.stopPropagation();
      this.activeThreadMessageIndex = index;
    }
  }

  /**
  * Closes the icon container by setting the active message index to null.
  */
  closeIconContainerThread() {
    this.activeThreadMessageIndex = null;
  }

  /**
  * Toggles the editing state of a message container based on the provided index and event. Stops event propagation always.
  * If the edit message index matches the provided index, it closes the editor by resetting relevant indices to null.
  * Otherwise, it sets up the editor for a new message, using the provided content and updates indices to reflect the current editing state.
  */
  toggleEditMessageContainerThread(index: number, event: MouseEvent, messageContent: string): void {
    event.stopPropagation();
    if (this.editMessageIndexThread === index) {
      this.editMessageIndexThread = null;
      this.editMessageInputIndexThread = null;
    } else {
      this.activeThreadMessageIndex = null;
      this.editOpenThread = true;
      this.editTextThread = messageContent;
      this.editMessageIndexThread = index;
      this.editMessageInputIndexThread = index;
    }
  }

  /**
  * Closes the message editor without saving changes. It resets the editing state indices and closes the editor immediately.
  * After a brief delay, it also resets the active message index to ensure the interface reflects the closure of any active interactions.
  */
  closeWithoutSavingThread() {
    this.editMessageIndexThread = null;
    this.editMessageInputIndexThread = null;
    this.editOpenThread = false;
    setTimeout(() => {
      this.activeThreadMessageIndex = null;
    }, 125);
  }

  /**
  * Asynchronously sends a message from a specific channel, updating the channel data and triggering
  * a sendMessage process.
  * @param {string} channelId - The ID of the channel from which to send the message.
  * @param {string} textContent - The text content of the message.
  */
  async sendMessageFromThread(channelId: string, textContent: string) {
    if (textContent || this.chatService.imageMessage) {
      this.chatService.messageThread.message = textContent;
      this.chatService.messageThread.date = Date.now();
      this.chatService.messageThread.userId = this.mainService.loggedInUser.id;
      this.chatService.messageThread.userName = this.mainService.loggedInUser.name;
      this.chatService.messageThread.userEmail = this.mainService.loggedInUser.email;
      this.chatService.messageThread.userAvatar = this.mainService.loggedInUser.avatar;
      this.chatService.messageChannel.imageToMessage = this.chatService.imageMessage as ArrayBuffer;
      this.chatService.dataThread.messageChannel.push(this.chatService.messageThread);
      this.sendMessageToThread();
      this.resetMessageContentThread();
    }
  }

  /**
  * Resets message content by clearing text and image message properties.
  */
  resetMessageContentThread() {
    this.textThread = '';
    this.chatService.imageMessage = '';
  }

  /**
  * Asynchronously edits a message within a channel by updating its text and then sends an update notification. It finalizes by closing the editor without saving further changes.
  */
  async editMessageFromThread(parmsId: string, newText: string, singleMessageIndex: number) {
    this.chatService.dataThread.messageChannel[singleMessageIndex].message = newText;
    if (singleMessageIndex === 0) {
      this.chatService.dataChannel.messageChannel[this.chatService.indexOfThreadMessageForEditChatMessage].message = newText;
      await this.mainService.addDoc('channels', this.chatService.dataChannel.id, new Channel(this.chatService.dataChannel));
    }
    await this.mainService.addDoc('threads', this.chatService.dataThread.id, new Channel(this.chatService.dataThread));
    this.closeWithoutSavingThread();
  }

  /**
  * Initiates the process to add a new document for a message within a specified channel.
  */
  sendMessageToThread() {
    this.mainService.addDoc('threads', this.chatService.dataThread.id, new Channel(this.chatService.dataThread));
  }

  /**
  * Determines if the selected message from a thread is the original message based on its index.
  * Sets `ownerThreadMessage` to true if it is the first message, otherwise sets it to false.
  * @param {number} indexSingleMessage - The index of the message in the thread to check.
  */
  ifMessageOwnerMessageFromThread(indexSingleMessage: number) {
    if (indexSingleMessage === 0) {
      this.chatService.ownerThreadMessage = true;
    } else {
      this.chatService.ownerThreadMessage = false;
    }
  }
}
