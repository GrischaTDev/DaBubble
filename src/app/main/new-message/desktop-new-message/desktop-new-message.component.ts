import {
  Component,
  ElementRef,
  inject,
  ViewChild,
  HostListener,
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
import { Firestore, docData } from '@angular/fire/firestore';
import { Message } from '../../../../assets/models/message.class';
import { User } from '../../../../assets/models/user.class';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiService } from '../../../service/emoji.service';
import { MobileChatHeaderComponent } from '../../header/mobile-chat-header/mobile-chat-header.component';
import { SearchFieldService } from '../../../search-field.service';
import { DirectMessageService } from '../../../service/direct-message.service';
import { Subscription } from 'rxjs';
import { Channel } from '../../../../assets/models/channel.class';

@Component({
  selector: 'app-desktop-new-message',
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
  templateUrl: './desktop-new-message.component.html',
  styleUrl: './desktop-new-message.component.scss',
})
export class DesktopNewMessageComponent implements OnInit {
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
  activeMessageIndex: number | null = null;
  hoveredMessageIndex: number | null = null;
  searchText: string = '';
  private channelSubscription!: Subscription;

  userData: User | undefined;
  channelData: Channel | undefined;
  allChannel: Channel[] = [];

  constructor(
    private route: ActivatedRoute,
    public chatService: ChatService,
    public emojiService: EmojiService,
    public mainService: MainServiceService,
    public searchField: SearchFieldService,
    public directMessageService: DirectMessageService
  ) {
    this.route.params.subscribe((params: any) => {
      this.parmsId = params.id;
      chatService.idOfChannel = params.id;
    });
    if (this.parmsId) {
      this.items$ = docData(mainService.getDataRef(this.parmsId, 'channels'));
      this.items = this.items$.subscribe((channel: any) => {
        this.chatService.dataChannel = channel;
      });
    }
    this.subscription = mainService.currentContentEmoji.subscribe((content) => {
      this.text += content;
    });
    this.loggedInUser = mainService.loggedInUser;

    if (!this.directMessageService.dataDirectMessage) {
      this.directMessageService.dataDirectMessage = {} as Channel;
    } else if (!this.directMessageService.dataDirectMessage.messageChannel) {
      this.directMessageService.dataDirectMessage.messageChannel = [];
    }

  }
  ngOnInit(): void {
    this.subscription = this.searchField.allChannel$.subscribe(channels => {
      this.allChannel = channels;
    });
  }

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  private lastScrollHeight = 0;

  /**
   * Toggles the icon container based on the provided index and event.
   *
   * @param index - The index of the icon container.
   * @param event - The mouse event that triggered the toggle.
   */
  toggleIconContainer(index: number, event: MouseEvent): void {
    event.stopPropagation();
    if (this.activeMessageIndex === index) {
      this.activeMessageIndex = null;
    } else {
      this.activeMessageIndex = index;
    }
  }

  @ViewChild('autofocus') meinInputField!: ElementRef;

  ngAfterViewInit() {
    this.focusInputField();
    this.channelSubscription = this.chatService.channelChanged$.subscribe(() => {
      this.focusInputField();
    });
  }

  private focusInputField() {
    setTimeout(() => {
      this.meinInputField.nativeElement.focus();
    }, 0);
  }

  @HostListener('document:click', ['$event'])
  /**
   * Handles the document click event.
   */
  onDocumentClick(): void {
    this.activeMessageIndex = null;
  }

  /**
   * Handles the mouse enter event for a message.
   *
   * @param index - The index of the message being hovered.
   */
  onMouseEnter(index: number): void {
    this.hoveredMessageIndex = index;
  }

  /**
   * Event handler for when the mouse leaves the component.
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

    if (this.channelSubscription) {
      this.channelSubscription.unsubscribe();
    }
  }

  async chooseUser(name: string, user: User) {
    this.searchText = name;
    this.userData = user;
    try {
      await this.directMessageIsAvailable(this.userData)
    }
    catch(err) {
      console.log('Ist hier ein Fehler:', err);
    }
    console.log(this.userData)
  }

  chooseChannel(name: string, channel: any) {
    this.searchText = name;
    this.channelData = new Channel(channel);
  }

  async sendMessage(message: string) {
    if(this.userData) {
      console.log(this.chatService.dataChannel.id);
      this.directMessageService.sendMessageFromDirectMessage(this.directMessageService.dataDirectMessage.id, message);
    } else if (this.channelData) {
      console.log('Das sind die Daten aus dem Channel den man gewählt hat:', this.channelData)
      this.chatService.messageChannel = new Message(this.channelData);
      console.log('Übergeben der Daten an den chatService:', this.chatService.messageChannel)
      await this.chatService.sendMessageFromChannel(this.channelData.id, message);
    }
  }

  async directMessageIsAvailable(userData: User) {
    this.directMessageService.directMessageIdIsAvailable = false;
    this.directMessageService.directMessageId = '';
    let choosedUserMessages = userData.message;
    let loggedInUserMessages = this.mainService.loggedInUser.message;
    if (Array.isArray(choosedUserMessages) && Array.isArray(loggedInUserMessages)) {
      let commonMessages = choosedUserMessages.filter(msg => loggedInUserMessages.includes(msg));
      if (commonMessages.length !== 0) {
        this.directMessageService.directMessageDocId = commonMessages[0].toString();
        this.directMessageService.directMessageIdIsAvailable = true;
      }
    }
    await this.pushDirectMessageDocToFirebase(userData);
  }

  async pushDirectMessageDocToFirebase(userData: User) {
    if (!this.directMessageService.directMessageIdIsAvailable) {
      this.directMessageService.newDataDirectMessage.channelUsers = [];
      await this.mainService.addNewDocOnFirebase('direct-message', new Channel(this.directMessageService.newDataDirectMessage));
      await this.pushDirectMessageIdToUser(userData);
    }
  }

  async pushDirectMessageIdToUser(userData: User) {
    this.mainService.loggedInUser.message.push(this.mainService.docId);
    userData.message.push(this.mainService.docId);
    this.directMessageService.directMessageId = this.mainService.docId;
    this.directMessageService.newDataDirectMessage.id = this.mainService.docId;
    this.directMessageService.newDataDirectMessage.channelUsers.push(new User(this.mainService.loggedInUser));
    this.directMessageService.newDataDirectMessage.channelUsers.push(new User(userData));
    this.pushNewDirectmessageContenToFb(userData);
  }

  async pushNewDirectmessageContenToFb(userData: User) {
    await this.mainService.addDoc(
      'users', this.mainService.loggedInUser.id, new User(this.mainService.loggedInUser));
    await this.mainService.addDoc('users', userData.id, new User(userData)
    );
    await this.mainService.addDoc('direct-message', this.directMessageService.directMessageDocId, new Channel(this.directMessageService.newDataDirectMessage)
    );
  }

}
