import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DialogEmojiComponent } from '../../dialog/dialog-emoji/dialog-emoji.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MainServiceService } from '../../../service/main-service.service';
import { ChatService } from '../../../service/chat.service';
import { MobileHeaderComponent } from '../../header/mobile-header/mobile-header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  docData,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Message } from '../../../../assets/models/message.class';
import { User } from '../../../../assets/models/user.class';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MobileChatHeaderComponent } from '../../header/mobile-chat-header/mobile-chat-header.component';

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
  directUserId: string = '';

  constructor(
    private route: ActivatedRoute,
    public chatService: ChatService,
    public mainService: MainServiceService,
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

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const directUserId = params.get('userId');

      if (directUserId) {
        this.loadDirectChatUser(directUserId); 
      }
    });
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


  /**
   * A lifecycle hook that is called when the component is destroyed.
   * Used for any custom cleanup that needs to occur when the component is taken out of the DOM.
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
