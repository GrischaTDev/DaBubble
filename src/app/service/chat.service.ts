import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogEmojiComponent } from '../main/dialog/dialog-emoji/dialog-emoji.component';
import { DialogMentionUsersComponent } from '../main/dialog/dialog-mention-users/dialog-mention-users.component';

import { Channel } from '../../assets/models/channel.class';
import { Message } from '../../assets/models/message.class';
import { MainServiceService } from './main-service.service';
import { docData, Firestore } from '@angular/fire/firestore';
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
  savedEmojis: string[] = [];
  emojiForHTML: Emoji[] = [];

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

  sendMessageFromChannel(channelId: string, textContent: string) {
    this.messageChannel.message = textContent;
    this.messageChannel.date = Date.now();
    this.messageChannel.userId = this.mainService.loggedInUser.id;
    this.messageChannel.userName = this.mainService.loggedInUser.name;
    this.messageChannel.userEmail = this.mainService.loggedInUser.email;
    this.messageChannel.userAvatar = this.mainService.loggedInUser.avatar;
    this.dataChannel.messageChannel.push(this.messageChannel);
    this.setSubcontentCollection('channels', channelId);
  }

  async setSubcontentCollection(docName: string, channelId: string) {
    await this.mainService.addNewDocOnFirebase('emoji', this.newEmojiArray);
    this.dataChannel.messageChannel[this.indexOfChannelMessage].emojis.push(
      this.mainService.docId
    );
    await this.mainService.addNewDocOnFirebase('mentionUser', this.mentionUser);
    this.dataChannel.messageChannel[
      this.indexOfChannelMessage
    ].mentionUser.push(this.mainService.docId);
    await this.mainService.addNewDocOnFirebase('thread', this.messageThread);
    this.dataChannel.messageChannel[this.indexOfChannelMessage].thread =
      this.mainService.docId;
    this.sendMessage(docName, channelId);
  }

  sendMessage(docName: string, channelId: string) {
    this.mainService.addCollection(
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

  async addReactionToMessage(emoji: string) {
    let docData = {
      emoji: emoji,
      id: this.mainService.loggedInUser.id
    }
    this.newEmoji.emoji = emoji;
    this.newEmoji.id.push(this.mainService.loggedInUser.id)
    this.newEmojiArray.emojis.push(this.newEmoji) 
    let refEmojieOfMessage =
      this.dataChannel.messageChannel[this.indexOfChannelMessage].emojis[0];
   
      
      this.mainService.updateDoc('emoji', refEmojieOfMessage,  this.newEmojiArray);

    /*  for (let index = 0; index < refEmojieOfMessage.length; index++) {
        let items$ = docData(
          this.mainService.getDataRef(refEmojieOfMessage[index], 'emoji')
        );
        items$.subscribe((emojiObj: any) => {
          this.savedEmojis.push(emojiObj.emoji);
          for (let index = 0; index < this.savedEmojis.length; index++) {
            const savedEmoji = this.savedEmojis[index];
            if (savedEmoji === emoji) {
              this.mainService.messageEmoji[index].users.push(
                this.mainService.testUser
              );
            } else {
              this.mainService.messageEmoji.push(this.newEmoji);
            }
          }
        });
      } */
  }

  loadEmojiFromMessage(singleMessage: Message) {
    this.emojiForHTML = [];
    let emojiArray = singleMessage.emojis;
    for (let index = 0; index < emojiArray.length; index++) {
      const refDoc = emojiArray[index];
      let items$ = docData(this.mainService.getDataRef(refDoc, 'emoji'));
      items$.subscribe((emojiObj: any) => {
        this.emojiForHTML.push(emojiObj);
      });
    }
    return this.emojiForHTML;
  }
}
