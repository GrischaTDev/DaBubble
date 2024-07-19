import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  HostListener,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DialogEmojiComponent } from '../../dialog/dialog-emoji/dialog-emoji.component';
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';
import { MainServiceService } from '../../../service/main-service.service';
import { ChatService } from '../../../service/chat.service';
import { MobileHeaderComponent } from '../../header/mobile-header/mobile-header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { Firestore, docData } from '@angular/fire/firestore';
import { Message } from '../../../../assets/models/message.class';
import { User } from '../../../../assets/models/user.class';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MobileChatHeaderComponent } from '../../header/mobile-chat-header/mobile-chat-header.component';
import { EmojiService } from '../../../service/emoji.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    MobileHeaderComponent,
    CommonModule,
    PickerComponent,
    MobileChatHeaderComponent,
  ],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss',
})
export class DirectChatComponent implements OnInit {
  items$;
  items;
  parmsId: string = '';
  text: string = '';
  public dialog = inject(MatDialog);
  dialogInstance?: MatDialogRef<DialogEmojiComponent>;
  subscription;
  dialogOpen = false;
  firestore: Firestore = inject(Firestore);
  messageToChannel: Message = new Message();
  loggedInUser: User = new User();
  directUser: User = new User();
  directUserStatus: string = './assets/img/offline-icon.svg';
  directUserId: string = '';
  activeMessageIndex: number | null = null;
  hoveredMessageIndex: number | null = null;

  constructor(
    private route: ActivatedRoute,
    public chatService: ChatService,
    public mainService: MainServiceService,
    public emojiService: EmojiService
  ) {
    if (this.parmsId) {
      this.items$ = docData(
        mainService.getDataRef(
          this.chatService.directMessageId,
          'direct-message'
        )
      );
      this.items = this.items$.subscribe((directMessage: any) => {
        this.chatService.dataDirectMessage = directMessage;
      });
    }
    this.chatService.loadDirectChatContent(this.chatService.directMessageId);
    this.subscription = mainService.currentContentEmoji.subscribe((content) => {
      this.text += content;
    });
    this.loggedInUser = mainService.loggedInUser;
  }

  /**
   * Initializes the component by subscribing to route parameters and loading direct chat content if a user ID is present.
   * It handles data loading, user validation, and status checks. Errors during chat loading are logged.
   */
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const directMessageId = params.get('userId');
      if (directMessageId) {
        this.chatService
          .loadDirectChatContent(directMessageId)
          .then(() => {
            this.validationOfTheOtherUser();
            this.checkUserStatus();
          })
          .catch((error) => {
            console.error('Fehler beim Laden des Chats:', error);
          });
      }
    });
  }

  /**
   * Validates the other user involved in the direct message by iterating over the channel users.
   * It assigns the user details to 'this.directUser' if the user ID does not match the logged-in user's ID.
   * @async
   */
  async validationOfTheOtherUser() {
    console.log('232323', this.chatService.dataDirectMessage);
    this.chatService.dataDirectMessage.channelUsers.forEach((user) => {
      if (user.id !== this.loggedInUser.id) {
        this.directUser = new User(user);
      }
    });
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
   * A lifecycle hook that is called when the component is destroyed.
   * Used for any custom cleanup that needs to occur when the component is taken out of the DOM.
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  /**
   * Opens a user profile in a modal dialog using Angular Material's Dialog component.
   * The function configures the dialog to display details about a specified user.
   * @param {User} directUser - The user whose profile is to be displayed in the dialog.
   */
  openUserProfile(directUser: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = directUser;
    this.dialog.open(UserProfileComponent, dialogConfig);
  }
}
