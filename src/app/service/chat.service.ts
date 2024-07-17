import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogEmojiComponent } from '../main/dialog/dialog-emoji/dialog-emoji.component';
import { DialogMentionUsersComponent } from '../main/dialog/dialog-mention-users/dialog-mention-users.component';
import { Channel } from '../../assets/models/channel.class';
import { Message } from '../../assets/models/message.class';
import { MainServiceService } from './main-service.service';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { MentionUser } from '../../assets/models/mention-user.class';
import { DialogUserChatComponent } from '../main/dialog/dialog-user-chat/dialog-user-chat.component';
import { User } from '../../assets/models/user.class';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  contentEmojie: any;
  public dialog = inject(MatDialog);
  firestore: Firestore = inject(Firestore);
  dialogInstance:
    | MatDialogRef<DialogEmojiComponent, any>
    | MatDialogRef<DialogMentionUsersComponent, any>
    | MatDialogRef<DialogUserChatComponent, any>
    | undefined;
  dialogEmojiOpen = false;
  dialogMentionUserOpen = false;
  mentionUser: MentionUser = new MentionUser();
  dataChannel: Channel = new Channel();
  messageChannel: Message = new Message();
  messageThread: Message = new Message();
  idOfChannel: string = '';
  indexOfChannelMessage: number = 0;
  clickedUser: User = new User();
  directMessageId: string = '';
  dataDirectMessage: Channel = new Channel();

  constructor(public mainService: MainServiceService, private router: Router) {}

  /**
   * Adjusts the height of a textarea to fit its content without scrolling.
   * This function sets the textarea's overflow to hidden and height to the scrollHeight of the textarea,
   * ensuring that the textarea fully displays all its content without needing an internal scrollbar.
   * @param {EventTarget | null} eventTarget - The target of the event, expected to be a textarea element, or null.
   */
  adjustHeight(eventTarget: EventTarget | null): void {
    if (eventTarget instanceof HTMLTextAreaElement) {
      const textarea = eventTarget;
      textarea.style.overflow = 'hidden';
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      window.scrollTo(0, document.body.scrollHeight);
    }
  }

  /**
   * Manages the state of the emoji dialog. If the emoji dialog is not open or if the chat dialog is open,
   * it attempts to close any currently open dialogs and opens the emoji dialog. If the emoji dialog is already open,
   * it simply closes it.
   */
  openDialogEmoji() {
    this.mainService.emojiReactionMessage = false;
    if (!this.dialogEmojiOpen || this.dialogMentionUserOpen) {
      this.closeDialog();
      this.dialogInstance = this.dialog.open(DialogEmojiComponent);
      this.dialogEmojiOpen = true;
    } else {
      this.closeDialog();
    }
  }

  /**
   * Manages the state of the chat dialog. If the chat dialog is not open or if the emoji dialog is open,
   * it closes any currently open dialogs and then opens the chat dialog. If the chat dialog is already open,
   * it simply closes it.
   *
   * This ensures that only one type of dialog (emoji or chat) can be open at a time.
   */
  openDialogMentionUser() {
    if (!this.dialogMentionUserOpen || this.dialogEmojiOpen) {
      this.closeDialog();
      this.dialogInstance = this.dialog.open(DialogMentionUsersComponent);
      this.dialogMentionUserOpen = true;
    } else {
      this.closeDialog();
    }
  }

  /**
   * Handles the emoji button click event.
   * Prevents the event from propagating to parent elements.
   *
   * @param {MouseEvent} event - The mouse event triggered by clicking the emoji button.
   */
  onButtonClick(event: MouseEvent): void {
    event.stopPropagation(); // Stoppt die Übertragung des Events zum Elternelement
  }

  /**
   * Closes the dialog if it is currently open.
   * Logs the attempt and the result of the dialog closure.
   */
  closeDialog(): void {
    if (this.dialogInstance) {
      this.dialogInstance.close();
      this.dialogEmojiOpen = false;
      this.dialogMentionUserOpen = false;
    }
  }

  /**
   * Prevents an event from bubbling up the event chain.
   * Typically used to stop a parent handler from being notified of an event.
   * @param {Event} event - The event to stop propagation for.
   */
  doNotClose(event: Event) {
    event.stopPropagation();
  }

  /**
   * Asynchronously sends a message from a specific channel, updating the channel data and triggering
   * a sendMessage process.
   * @param {string} channelId - The ID of the channel from which to send the message.
   * @param {string} textContent - The text content of the message.
   */
  async sendMessageFromChannel(channelId: string, textContent: string) {
    this.messageChannel.message = textContent;
    this.messageChannel.date = Date.now();
    this.messageChannel.userId = this.mainService.loggedInUser.id;
    this.messageChannel.userName = this.mainService.loggedInUser.name;
    this.messageChannel.userEmail = this.mainService.loggedInUser.email;
    this.messageChannel.userAvatar = this.mainService.loggedInUser.avatar;
    this.dataChannel.messageChannel.push(this.messageChannel);
    this.sendMessage('channels', channelId);
  }

  /**
   * Initiates the process to add a new document for a message within a specified channel.
   * @param {string} docName - The name of the document to be added.
   * @param {string} channelId - The ID of the channel where the document should be added.
   */
  sendMessage(docName: string, channelId: string) {
    this.mainService.addDoc(docName, channelId, new Channel(this.dataChannel));
  }

  /**
   * Converts a timestamp from the server into a localized date string. If the date is today, it returns "Heute".
   * @param {number} timeFromServer - The timestamp from the server to be converted.
   * @returns {string} A formatted date string or "Heute" if the date is today.
   */
  setDate(timeFromServer: number): string {
    const date = new Date(timeFromServer);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };
    const localeDate = date.toLocaleDateString('de-DE', options);
    const today = new Date();
    const todayLocaleDate = today.toLocaleDateString('de-DE', options);
    if (localeDate === todayLocaleDate) {
      return 'Heute';
    } else {
      return localeDate;
    }
  }

  /**
   * Converts a timestamp from the server into a localized time string in 24-hour format.
   * @param {number} timeFromServer - The timestamp from the server to be converted.
   * @returns {string} A formatted time string in HH:mm format.
   */
  setTime(timeFromServer: number): string {
    const date = new Date(timeFromServer);
    const formattedTime = date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return formattedTime;
  }

  /**
   * Checks if the message is sent by the logged-in user.
   * @param {string} userIdFromMessage - The user ID from the message to compare.
   * @returns {boolean} True if the message is from the logged-in user, false otherwise.
   */
  ifMessageFromMe(userIdFromMessage: string): boolean {
    return userIdFromMessage === this.mainService.loggedInUser.id;
  }

  /**
   * Manages the state of the emoji dialog. If the emoji dialog is not open or if the chat dialog is open,
   * it attempts to close any currently open dialogs and opens the emoji dialog. If the emoji dialog is already open,
   * it simply closes it.
   */
  openDialogEmojiReactionMessage(index: number) {
    this.mainService.emojiReactionMessage = true;
    this.indexOfChannelMessage = index;
    if (!this.dialogEmojiOpen || this.dialogMentionUserOpen) {
      this.closeDialog();
      this.dialogInstance = this.dialog.open(DialogEmojiComponent);
      this.dialogEmojiOpen = true;
    } else {
      this.closeDialog();
    }
  }

  async  openProfil(userId:string) {  
    await this.loadDirectChatUser(userId); 
    this.clickedUser.id = userId;
    this.dialogInstance = this.dialog.open(DialogUserChatComponent);
  }

  async loadDirectChatUser(userId: string) {
    try {
      const userDocRef = doc(this.firestore, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        this.clickedUser = new User(userDocSnap.data());
      } 
    } catch (error) {
      console.error("Fehler beim Laden der Benutzerdaten:", error);
    }
  }

openDirectMessage() {
  this.directMessageIsAvailable();
  this.pushDirectMessageToFirebase();  
}

directMessageIsAvailable() {
  this.directMessageId = '';
  this.clickedUser.message.forEach(clickedUserMessage => {
    this.mainService.loggedInUser.message.forEach(loggedInUserMessage => {
      if (clickedUserMessage === loggedInUserMessage) {
        this.directMessageId === loggedInUserMessage;
      }
    });
  });
}

async pushDirectMessageToFirebase() {
  if (this.directMessageId === '') {
    await this.mainService.addNewDocOnFirebase(
      'direct-message',
      this.dataDirectMessage
    ) 
    this.pushDirectMessageIdToUser();
  } else {
    this.mainService.addDoc('direct-message', this.directMessageId, new Channel(this.dataChannel));
  }
}

async pushDirectMessageIdToUser() {
  this.mainService.loggedInUser.message.push(this.mainService.docId);
  this.clickedUser.message.push(this.mainService.docId);
  await this.mainService.addDoc('users', this.mainService.loggedInUser.id, new Channel(this.mainService.loggedInUser));
  await this.mainService.addDoc('users', this.clickedUser.id, new Channel(this.clickedUser));
}

navigateDirectMessage(userId: string) {
  this.router.navigate(['/direct-chat', userId]); 
}
}
