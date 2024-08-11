import {
  Component,
  ElementRef,
  inject,
  ViewChild,
  HostListener,
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
export class DesktopNewMessageComponent {
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

  userData: any;
  channelData: any;

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
  }

  chooseUser(name: string, user: any) {
    this.searchText = name;
    this.userData = user;
    console.log(this.userData)
  }

  chooseChannel(name: string, channel: any) {
    this.searchText = name;
    this.channelData = channel;
  }

  sendMessage(message: string) {
    if(this.userData) {
      console.log(this.userData)
      this.directMessageService.sendMessageFromDirectMessage(this.userData.idUser, message);
      this.userData = '';
    } else if (this.channelData) {
      console.log('Das sind die Daten aus dem Channel den man gewählt hat:', this.channelData)
      this.chatService.messageChannel = new Message(this.channelData);
      console.log('Übergeben der Daten an den chatService:', this.chatService.messageChannel)
      this.chatService.sendMessageFromChannel(this.channelData.id, message);
      this.channelData = '';
    }
  }

}
