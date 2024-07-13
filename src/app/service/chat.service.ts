import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogEmojiComponent } from '../main/dialog/dialog-emoji/dialog-emoji.component';
import { DialogMentionUsersComponent } from '../main/dialog/dialog-mention-users/dialog-mention-users.component';

import { Channel } from '../../assets/models/channel.class';
import { Message } from '../../assets/models/message.class';
import { MainServiceService } from './main-service.service';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Emoji } from '../../assets/models/emoji.class';
import { MentionUser } from '../../assets/models/mention-user.class';
import { EmojiCollection } from '../../assets/models/emojiCollection.class';

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
    | undefined;
  dialogEmojiOpen = false;
  dialogMentionUserOpen = false;
  mentionUser: MentionUser = new MentionUser();
  dataChannel: Channel = new Channel();
  messageChannel: Message = new Message();
  messageThread: Message = new Message();
  idOfChannel: string = '';
  indexOfChannelMessage: number = 0;
  newEmoji: Emoji = new Emoji();
  newEmojiArray: EmojiCollection = new EmojiCollection();
  newEmojiArrayHTML: EmojiCollection = new EmojiCollection();
  savedEmojis: string[] = [];
  newEmojiData: EmojiCollection = new EmojiCollection();
  searchEmojis: string[] = [];
  emojiIsAvailable = false;
  
  constructor(public mainService: MainServiceService) {}

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

  sendMessage(docName: string, channelId: string) {
    this.mainService.addDoc(
      docName,
      channelId,
      new Channel(this.dataChannel)
    );
  }

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

  setTime(timeFromServer: number): string {
    const date = new Date(timeFromServer);
    const formattedTime = date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return formattedTime;
  }

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

  addReactionToMessage(emoji: string) {
    for (let index = 0; index < this.dataChannel.messageChannel[this.indexOfChannelMessage].emojiReaction.length; index++) {
      const emojiOnForebase = this.dataChannel.messageChannel[this.indexOfChannelMessage].emojiReaction[index].emoji;
      if (emoji === emojiOnForebase) {
        this.emojiIsAvailable = true;
      }
      }
    if (!this.emojiIsAvailable) {
      this.pushEmojiToArray(emoji)
    }
  }

 async pushEmojiToArray(emoji: string) {
  this.newEmoji.emoji = emoji;
  this.newEmoji.user = [];
  this.newEmoji.user.push(this.mainService.loggedInUser.id)
  this.dataChannel.messageChannel[this.indexOfChannelMessage].emojiReaction.push(this.newEmoji.toJSON());
  await setDoc(doc(this.firestore, "channels", this.idOfChannel), this.dataChannel);
  }

  pushUserToEmoji(refEmojieOfMessage: string, indexEmoji: number) {
    let indexUser = this.newEmojiArray.emojis[indexEmoji].user.indexOf(
      this.mainService.loggedInUser.id
    );
    if (indexUser === -1) {
      this.newEmojiArray.emojis[indexEmoji].user.push(
        this.mainService.loggedInUser.id
      );
    }
    this.pushEmojiToFirebase(refEmojieOfMessage);
  }

  pushEmojiToFirebase(refEmojieOfMessage: string) {
    this.mainService.addDoc(
      'emoji',
      refEmojieOfMessage,
      new EmojiCollection(this.newEmojiArray)
    );
  }
}
