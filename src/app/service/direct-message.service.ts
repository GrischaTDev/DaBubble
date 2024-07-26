import { ElementRef, HostListener, inject, Injectable, ViewChild } from '@angular/core';
import { Channel } from '../../assets/models/channel.class';
import { ChatService } from './chat.service';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { User } from '../../assets/models/user.class';
import { MainServiceService } from './main-service.service';
import { Router } from '@angular/router';
import { Message } from '../../assets/models/message.class';
import { DialogUserChatComponent } from '../main/dialog/dialog-user-chat/dialog-user-chat.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DirectMessageService {
  directMessageId: string = '';
  newDataDirectMessage: Channel = new Channel();
  dataDirectMessage: Channel = new Channel();
  directMessageDocId: string = '';
  directMessageIdIsAvailable = false;
  firestore: Firestore = inject(Firestore);
  public dialog = inject(MatDialog);
  dialogOpen = false;
  messageToChannel: Message = new Message();
  directUser: User = new User();
  loggedInUserUpdate: User = new User();
  directUserStatus: string = './assets/img/offline-icon.svg';
  directUserId: string = '';
  loggedInUserId: string = '';
  activeMessageIndex: number | null = null;
  hoveredMessageIndex: number | null = null;
  indexUserDirectmessage: number = 0;
  directChatOpen: boolean = false;
  desktopChatOpen: boolean = true;;


  constructor(public chatService: ChatService, public mainService: MainServiceService, private router: Router) { }

  /**
 * Opens a user profile and initializes a chat dialog.
 * @async
 * @param {string} userId - The ID of the user whose profile is to be opened.
 */
  async openProfil(userId: string) {
    this.chatService.clickedUser.id = userId;
    await this.loadDirectChatUser(userId);
    this.chatService.dialogInstance = this.dialog.open(DialogUserChatComponent);
  }

  /**
 * Asynchronously validates and identifies the other user in a direct messaging context.
 * If the current user is the only one in the channel, the current user is duplicated as 'directUser'.
 * Otherwise, the 'directUser' is set to the first other user found in the channel.
 */
  async validationOfTheOtherUser() {
    const loggedInUserId = this.mainService.loggedInUser.id;
    const otherUsers = this.dataDirectMessage.channelUsers.filter(user => user.id !== loggedInUserId);
    if (otherUsers.length === 0) {
      this.directUser = new User(this.mainService.loggedInUser);
    } else {
      for (let index = 0; index < this.dataDirectMessage.channelUsers.length; index++) {
        const user = this.dataDirectMessage.channelUsers[index];
        this.directUser = new User(user);
      }
    }
  }

  /**
   * Checks the online status of the direct user and sets the corresponding status icon.
   * It updates the 'directUserStatus' property with a path to the appropriate icon image.
   */
  checkUserStatus() {
    if (this.directUser.online) {
      this.directUserStatus = './assets/img/online-icon.svg';
    } else {
      this.directUserStatus = './assets/img/offline-icon.svg';
    }
  }

  /**
   * @ViewChild Decorator to access the scroll container element in the template.
   * @type {ElementRef} Reference to the DOM element used for scrolling content.
   */
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
   * Toggles the visibility of an icon container for messages. It stops the propagation of the click event to prevent triggering parent handlers.
   * It sets or unsets the active message index based on whether the current index is already active.
   * @param {number} index - The index of the message whose icon container is to be toggled.
   * @param {MouseEvent} event - The mouse event associated with the action.
   */
  toggleIconContainer(index: number, event: MouseEvent): void {
    event.stopPropagation();
    if (this.activeMessageIndex === index) {
      this.activeMessageIndex = null;
    } else {
      this.activeMessageIndex = index;
    }
  }

  /**
   * Handles click events on the document level to reset the active message index.
   * This method ensures that the message icons are collapsed when clicking anywhere outside the message components.
   * @HostListener Decorator to listen for click events on the document.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(): void {
    this.activeMessageIndex = null;
  }

  /**
   * Sets the hovered message index when the mouse enters a message component.
   * This helps in identifying which message item is currently under the mouse cursor.
   * @param {number} index - The index of the message being hovered.
   */
  onMouseEnter(index: number): void {
    this.hoveredMessageIndex = index;
  }

  /**
   * Resets the hovered message index when the mouse leaves a message component.
   * This function is used to clear the hover state of message items.
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

  /**
* Loads the direct chat user's data from Firestore.
* @async
* @param {string} userId - The ID of the user to load.
*/
  async loadDirectChatUser(userId: string) {
    try {
      const userDocRef = doc(this.firestore, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        this.chatService.clickedUser = new User(userDocSnap.data());
        this.chatService.clickedUser.id = userId;
      }
    } catch (error) {
      console.error('Fehler beim Laden der Benutzerdaten:', error);
    }
  }

  /**
  * Opens a direct message with a specific user by loading user data, checking message availability,
  * pushing the direct message document to Firebase, and navigating to the message.
  * @async
  * @param {string} userId - The ID of the user with whom to open a direct message.
  */
  async openDirectMessage(userId: string) {
    this.chatService.clickedUser.id = userId;
    await this.loadDirectChatUser(userId);
    await this.directMessageIsAvailable();
    await this.pushDirectMessageDocToFirebase();
    this.directMessageDocId = this.mainService.docId;
    await this.loadDirectChatContent(this.directMessageId);
    await this.loadDirectChatUser(userId);
    this.navigateDirectMessage(this.directMessageId);
  }

  /**
 * Checks if a direct message is available between the clicked user and the logged-in user.
 * Updates the `directMessageIdIsAvailable` to true if there is a common message, and assigns
 * the first common message ID to `directMessageId`. Otherwise, resets the `directMessageId`.
 */
  async directMessageIsAvailable() {
    this.directMessageIdIsAvailable = false;
    this.directMessageId = '';
    let clickedUserMessages = await this.chatService.clickedUser.message;
    let loggedInUserMessages = await this.mainService.loggedInUser.message;
    if (Array.isArray(clickedUserMessages) && Array.isArray(loggedInUserMessages)) {
        let commonMessages = clickedUserMessages.filter(msg => loggedInUserMessages.includes(msg));
        if (commonMessages.length > 0) {
            this.directMessageId = commonMessages[0].toString();
            this.directMessageIdIsAvailable = true;
        }
    }
}

 /**
 * Pushes a new direct message document to Firebase if a direct message ID is not already available.
 * It checks if the logged-in user is the same as the clicked user, and sets the `messageToMe`
 * property accordingly. The document is added to Firebase under 'direct-message' collection,
 * and the direct message ID is pushed to the user.
 */
  async pushDirectMessageDocToFirebase() {
    if (!this.directMessageIdIsAvailable) {
      this.newDataDirectMessage.channelUsers = [];
      if (this.mainService.loggedInUser.id === this.chatService.clickedUser.id) {
        this.newDataDirectMessage.messageToMe = true;
      } else {
        this.newDataDirectMessage.messageToMe = false;
      }
      await this.mainService.addNewDocOnFirebase('direct-message', this.newDataDirectMessage);
      this.pushDirectMessageIdToUser();
    }
  }

  /**
   * Updates the message arrays for both the logged-in and clicked users with a new direct message ID.
   * Also updates the new direct message content in Firebase by adding both users to the message's channel users list.
   */
  pushDirectMessageIdToUser() {
    this.mainService.loggedInUser.message.push(this.mainService.docId);
    this.chatService.clickedUser.message.push(this.mainService.docId);
    this.directMessageId = this.mainService.docId;
    this.newDataDirectMessage.channelUsers.push(new User(this.mainService.loggedInUser));
    this.newDataDirectMessage.channelUsers.push(new User(this.chatService.clickedUser));
    this.pushNewDirectmessageContenToFb();
  }

  /**
   * Pushes new direct message content to Firebase by updating user documents for both the logged-in user and the clicked user,
   * and adding a new channel document for the direct message.
   * @async
   */
  async pushNewDirectmessageContenToFb() {
    await this.mainService.addDoc(
      'users', this.mainService.loggedInUser.id, new User(this.mainService.loggedInUser));
    await this.mainService.addDoc('users', this.chatService.clickedUser.id, new User(this.chatService.clickedUser)
    );
    await this.mainService.addDoc('direct-message', this.directMessageId, new Channel(this.newDataDirectMessage)
    );
  }

  /**
   * Navigates to the direct chat page using the specified direct message ID.
   * @param {string} id - The ID of the direct message to navigate to.
   */
  navigateDirectMessage(id: string) {
    this.router.navigate(['/direct-chat', id]);
  }

  /**
   * Sends a message within a direct message channel. It first loads the direct chat content, sets the new message details, and pushes the updated channel data to Firebase.
   * @async
   * @param {string} channelId - The ID of the direct message channel.
   * @param {string} textContent - The text content of the message to be sent.
   */
  async sendMessageFromDirectMessage(channelId: string, textContent: string) {
    await this.loadDirectChatContent(this.directMessageId);
    this.chatService.messageChannel.message = textContent;
    this.chatService.messageChannel.date = Date.now();
    this.chatService.messageChannel.userId = this.mainService.loggedInUser.id;
    this.chatService.messageChannel.userName = this.mainService.loggedInUser.name;
    this.chatService.messageChannel.userEmail = this.mainService.loggedInUser.email;
    this.chatService.messageChannel.userAvatar = this.mainService.loggedInUser.avatar;
    this.dataDirectMessage.messageChannel.push(this.chatService.messageChannel);
    await this.mainService.addDoc('direct-message', this.directMessageId, new Channel(this.dataDirectMessage)
    );
    this.chatService.text = '';
  }

  /**
   * Loads the content of a direct chat for a given user ID from Firestore. If the document exists, it initializes the data for direct messaging.
   * @async
   * @param {string} userId - The ID of the user whose direct message content is to be loaded.
   */
  async loadDirectChatContent(userId: string) {
    try {
      const userDocRef = doc(this.firestore, 'direct-message', userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        this.dataDirectMessage = new Channel(userDocSnap.data());
        this.dataDirectMessage.id = userId;
      }
    } catch (error) {
      console.error('Error loading channel data:', error);
    }
  }

  otherUser(singleUserId: string): boolean {
    if (singleUserId !== this.mainService.loggedInUser.id) {
      return true;
    } else if (this.indexUserDirectmessage > 1) {
      return true;
    } else if (singleUserId === this.mainService.loggedInUser.id) {
      this.indexUserDirectmessage++;
      return false;
    } else {
      return false;
    }
  }
}
