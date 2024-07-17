import { Component, ElementRef, inject, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DialogEmojiComponent } from '../../dialog/dialog-emoji/dialog-emoji.component';
import { MatDialog, MatDialogRef, MatDialogConfig  } from '@angular/material/dialog';
import { MainServiceService } from '../../../service/main-service.service';
import { ChatService } from '../../../service/chat.service';
import { MobileHeaderComponent } from '../../header/mobile-header/mobile-header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import {
  Firestore,
  doc,
  docData,
  getDoc,
} from '@angular/fire/firestore';
import { Message } from '../../../../assets/models/message.class';
import { User } from '../../../../assets/models/user.class';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MobileChatHeaderComponent } from '../../header/mobile-chat-header/mobile-chat-header.component';
import { EmojiService } from '../../../service/emoji.service';


@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    MobileHeaderComponent,
    CommonModule,
    PickerComponent,
    MobileChatHeaderComponent
  ],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss'
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
    public emojiService: EmojiService,
  ) {
    this.route.params.subscribe((params: any) => {
      this.parmsId = params.id;
      chatService.idOfChannel = params.id;
    });

    if (this.parmsId) {
      this.items$ = docData(mainService.getDataRef(this.parmsId, 'direct-message'));
      this.items = this.items$.subscribe((directMessage: any) => {
        this.chatService.dataDirectMessage = directMessage;
      });
    }
    this.subscription = mainService.currentContentEmoji.subscribe((content) => {
      this.text += content;
    });
    this.loggedInUser = mainService.loggedInUser;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const directUserId = params.get('userId');

      if (directUserId) {
        this.loadDirectChatUser(directUserId); 
      }
    });
    this.checkUserStatus();
  }


  /**
   * Load direct chat user data!
   * 
   * @param userId User ID to chat.
   */
  async loadDirectChatUser(userId: string) {
    try {
      const userDocRef = doc(this.firestore, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        this.directUser = userDocSnap.data() as User;
        console.log('Direct User:', this.directUser);
      } else {
        console.warn(`Benutzer mit ID ${userId} nicht gefunden.`);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Benutzerdaten:", error);
    }
  }


  checkUserStatus() {
    if(this.directUser.online) {
      this.directUserStatus = './assets/img/online-icon.svg';
    } else {
      this.directUserStatus = './assets/img/offline-icon.svg';
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

  toggleIconContainer(index: number, event: MouseEvent): void {
    event.stopPropagation(); 
    if (this.activeMessageIndex === index) {
      this.activeMessageIndex = null;
    } else {
      this.activeMessageIndex = index;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(): void {
    this.activeMessageIndex = null;
  }

  onMouseEnter(index: number): void {
    this.hoveredMessageIndex = index;
  }

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


  openUserProfile(directUser: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = directUser;
  
    this.dialog.open(UserProfileComponent, dialogConfig);
  }
}
