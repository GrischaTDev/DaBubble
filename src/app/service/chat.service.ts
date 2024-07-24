import { ElementRef, HostListener, Injectable, ViewChild, inject } from '@angular/core';
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
import { DialogAddUserComponent } from '../main/dialog/dialog-add-user/dialog-add-user.component';
import { channel } from 'diagnostics_channel';
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
    | MatDialogRef<DialogAddUserComponent, any>
    | undefined;
  dialogEmojiOpen = false;
  dialogMentionUserOpen = false;
  dialogAddUserOpen = false;
  mentionUser: MentionUser = new MentionUser();
  dataChannel: Channel = new Channel();
  messageChannel: Message = new Message();
  messageThread: Message = new Message();
  idOfChannel: string = '';
  indexOfChannelMessage: number = 0;
  clickedUser: User = new User();
  activeMessageIndex: number | null = null;
  hoveredMessageIndex: number | null = null;
  editMessageIndex: number | null = null;
  editMessageInputIndex: number | null = null;
  editOpen: boolean = false;
  text: string = '';
  editText: string = '';
  loggedInUser: User = new User();

  constructor(public mainService: MainServiceService, private router: Router) { }

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

  openDialogAddUser() {
    if (!this.dialogAddUserOpen) {
      this.closeDialog();
      this.dialogInstance = this.dialog.open(DialogAddUserComponent);
      this.dialogAddUserOpen = true;
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
      this.dialogAddUserOpen = false;

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
    this.text = '';
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

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  private lastScrollHeight = 0;

  /**
   * Lifecycle hook that is called after every check of the component's view.
   * Checks if the scrollHeight of the container has increased since the last check,
   * indicating that new content might have been added. If so, it scrolls to the bottom of the container
   * and updates the last known scrollHeight.
   */
  ngAfterViewChecked() {
    if (
      this.scrollContainer.nativeElement.scrollHeight > this.lastScrollHeight
    ) {
      this.scrollToBottom();
      this.lastScrollHeight = this.scrollContainer.nativeElement.scrollHeight;
    }
  }

  /**
 * Toggles the icon container based on the given index and event. Stops the event propagation if `editOpen` is false.
 * If the active message index matches the provided index, it closes the icon container; otherwise, it sets the active message index to the provided index.
 * @param {number} index - The index to check against the active message index.
 * @param {MouseEvent} event - The mouse event to possibly stop propagation on.
 */
  toggleIconContainer(index: number, event: MouseEvent): void {
    if (!this.editOpen) {
      event.stopPropagation();
      if (this.activeMessageIndex === index) {
        this.closeIconContainer();
      } else {
        this.activeMessageIndex = index;
      }
    }
  }

  /**
 * Closes the icon container by setting the active message index to null.
 */
  closeIconContainer() {
    this.activeMessageIndex = null;
  }

  /**
 * Toggles the editing state of a message container based on the provided index and event. Stops event propagation always.
 * If the edit message index matches the provided index, it closes the editor by resetting relevant indices to null.
 * Otherwise, it sets up the editor for a new message, using the provided content and updates indices to reflect the current editing state.
 * @param {number} index - The index of the message to potentially edit.
 * @param {MouseEvent} event - The mouse event, propagation of which is always stopped.
 * @param {string} messageContent - The content of the message to edit if the editor is opened.
 */
  toggleEditMessageContainer(index: number, event: MouseEvent, messageContent: string): void {
    event.stopPropagation();
    if (this.editMessageIndex === index) {
      this.editMessageIndex = null;
      this.editMessageInputIndex = null;
    } else {
      this.activeMessageIndex = null;
      this.editOpen = true;
      this.editText = messageContent;
      this.editMessageIndex = index;
      this.editMessageInputIndex = index;
    }
  }

  /**
 * Closes the message editor without saving changes. It resets the editing state indices and closes the editor immediately.
 * After a brief delay, it also resets the active message index to ensure the interface reflects the closure of any active interactions.
 */
  closeWithoutSaving() {
    this.editMessageIndex = null;
    this.editMessageInputIndex = null;
    this.editOpen = false;
    setTimeout(() => {
      this.activeMessageIndex = null;
    }, 125);
  }

  /**
 * Asynchronously edits a message within a channel by updating its text and then sends an update notification. It finalizes by closing the editor without saving further changes.
 * @param {string} parmsId - The parameter ID associated with the channel to notify of the update.
 * @param {string} newText - The new text to replace the existing message content.
 * @param {number} singleMessageIndex - The index of the message in the channel to be updated.
 */
 async editMessageFromChannel(parmsId: string, newText: string, singleMessageIndex:number) {
    this.dataChannel.messageChannel[singleMessageIndex].message = newText;
    await this.sendMessage('channels', parmsId);
    this.closeWithoutSaving();
  }

  /**
 * Handles click events on the document by resetting the active message index. This method ensures that any active message interactions are closed when clicking outside of a specific UI component.
 */
  @HostListener('document:click', ['$event'])
  onDocumentClick(): void {
    this.activeMessageIndex = null;
  }

  /**
 * Sets the hovered message index when the mouse enters a specific UI element. This function updates the hoveredMessageIndex to reflect the index of the currently hovered message.
 * @param {number} index - The index of the message that the mouse has entered.
 */
  onMouseEnter(index: number): void {
    this.hoveredMessageIndex = index;
  }

  /**
 * Resets the hovered message index when the mouse leaves a specific UI element. This function clears the hoveredMessageIndex to null, indicating no current message is being hovered over.
 */
  onMouseLeave(): void {
    this.hoveredMessageIndex = null;
  }

  /**
   * Scrolls the content of the scrollable container to the bottom.
   * This is typically used to ensure the user sees the most recent messages or content added to the container.
   */
  scrollToBottom(): void {
    this.scrollContainer.nativeElement.scrollTop =
      this.scrollContainer.nativeElement.scrollHeight;
  }
}
