import {
  Component,
  ElementRef,
  inject,
  ViewChild,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DialogEmojiComponent } from '../../dialog/dialog-emoji/dialog-emoji.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MainServiceService } from '../../../service/main-service.service';
import { ChatService } from '../../../service/chat.service';
import { MobileHeaderComponent } from '../../header/mobile-header/mobile-header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { User } from '../../../../assets/models/user.class';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiService } from '../../../service/emoji.service';
import { MobileChatHeaderComponent } from '../../header/mobile-chat-header/mobile-chat-header.component';
import { DirectMessageService } from '../../../service/direct-message.service';
import { LoginService } from '../../../service/login.service';
import { ChannelService } from '../../../service/channel.service';
import { Channel } from '../../../../assets/models/channel.class';
import { ThreadService } from '../../../service/thread.service';
import { SearchFieldService } from '../../../search-field.service';
import { DialogShowsUserReactionComponent } from '../../dialog/dialog-shows-user-reaction/dialog-shows-user-reaction.component';
import { lastValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-desktop-chat',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    MobileHeaderComponent,
    CommonModule,
    PickerComponent,
    MobileHeaderComponent,
    MobileChatHeaderComponent,
  ],
  templateUrl: './desktop-chat.component.html',
  styleUrl: './desktop-chat.component.scss',
})
export class DesktopChatComponent implements OnInit {
  parmsId: string = '';
  public dialog = inject(MatDialog);
  dialogInstance?:
    | MatDialogRef<DialogEmojiComponent>
    | MatDialogRef<DialogShowsUserReactionComponent>;

  dialogOpen = false;
  firestore: Firestore = inject(Firestore);
  emojiReactionIndexHover: number | null = null;
  activeMessageIndexReacton: number | null = null;
  private channelSubscription!: Subscription;
  allChannel: Channel[] = [];

  constructor(
    public chatService: ChatService,
    public emojiService: EmojiService,
    public mainService: MainServiceService,
    public directMessageService: DirectMessageService,
    public channelService: ChannelService,
    public loginService: LoginService,
    public threadService: ThreadService,
    public searchField: SearchFieldService,
  ) {
    this.chatService.loggedInUser = this.mainService.loggedInUser;
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  }

  /**
   * Initializes the component by fetching the current logged-in user and subscribing to changes in the user's status.
   * Upon receiving an update, it creates a new User instance and assigns it to a service for use within the application.
   * This is typically used to ensure that the component has access to the latest user information when it is initialized.
   */
  async ngOnInit() {
    this.loginService.currentLoggedUser();
    this.loginService.loggedInUser$.subscribe((user) => {
      this.mainService.loggedInUser = new User(user);
    });
    this.mainService.subscriptionChannels = this.searchField.allChannel$.subscribe((channels) => {
      this.allChannel = channels;
    });
    this.mainService.subscriptionTextChat = this.mainService.currentContent.subscribe(
      (content) => {
        if (!this.chatService.editOpen) {
          this.chatService.text += content;
        } else {
          this.chatService.editText += content;
        }
      },
    );

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
    if (this.allChannel.length !== 0) {
      if (
        this.scrollContainer.nativeElement.scrollHeight >
        this.lastScrollHeight &&
        this.chatService.sendetMessage
      ) {
        this.scrollToBottom();
        this.lastScrollHeight = this.scrollContainer.nativeElement.scrollHeight;
      }
    }
  }

  @ViewChild('autofocus') meinInputField!: ElementRef;
  ngAfterViewInit() {
    this.focusInputField();
    this.channelSubscription = this.chatService.channelChanged$.subscribe(
      () => {
        this.focusInputField();
      },
    );
  }

  private focusInputField() {
    setTimeout(() => {
      this.meinInputField.nativeElement.focus();
    }, 0);
  }

  /**
   * Scrolls the content of the scrollable container to the bottom.
   * This is typically used to ensure the user sees the most recent messages or content added to the container.
   */
  scrollToBottom(): void {
    if (this.allChannel.length !== 0) {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    }
  }

  toggleIconHoverContainerChat(
    singleMessageIndex: number,
    emojiUserIndex: number,
    event: MouseEvent,
  ) {
    event.stopPropagation();
    this.activeMessageIndexReacton = singleMessageIndex;
    this.emojiReactionIndexHover = emojiUserIndex;
  }

  toggleIconHoverContainerChatOut(event: MouseEvent) {
    this.activeMessageIndexReacton = null;
    this.emojiReactionIndexHover = null;
  }

  /**
   * A lifecycle hook that is called when the component is destroyed.
   * Used for any custom cleanup that needs to occur when the component is taken out of the DOM.
   */
  ngOnDestroy() {
    if (this.channelSubscription) {
      this.channelSubscription.unsubscribe();
    }
    if (this.mainService.subscriptionTextChat) {
      this.mainService.subscriptionTextChat.unsubscribe();
    }
  }

  chooseUser(name: string) {
    const atIndex = this.chatService.text.lastIndexOf('@');
    if (atIndex !== -1) {
      this.chatService.text =
        this.chatService.text.slice(0, atIndex + 1) + name + ' ';
      this.searchField.filterUser = [];
    }
  }

  checkForEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.chatService.sendMessageFromChannel(
        this.chatService.dataChannel.id,
        this.chatService.text,
      );
    }
  }
}
