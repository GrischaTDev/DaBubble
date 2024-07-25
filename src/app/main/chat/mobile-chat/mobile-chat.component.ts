import { Component, ElementRef, inject, ViewChild, HostListener, OnInit } from '@angular/core';
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
import { User } from '../../../../assets/models/user.class';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiService } from '../../../service/emoji.service';
import { MobileChatHeaderComponent } from '../../header/mobile-chat-header/mobile-chat-header.component';
import { DirectMessageService } from '../../../service/direct-message.service';
import { LoginService } from '../../../service/login.service';

@Component({
  selector: 'app-mobile-chat',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    MobileHeaderComponent,
    CommonModule,
    PickerComponent,
    MobileHeaderComponent,
    MobileChatHeaderComponent
  ],
  templateUrl: './mobile-chat.component.html',
  styleUrl: './mobile-chat.component.scss',
})
export class MobileChatComponent implements OnInit {
  items$;
  items;
  parmsId: string = '';
  public dialog = inject(MatDialog);
  dialogInstance?: MatDialogRef<DialogEmojiComponent>;
  subscription;
  dialogOpen = false;
  firestore: Firestore = inject(Firestore);


  constructor(
    private route: ActivatedRoute,
    public chatService: ChatService,
    public emojiService: EmojiService,
    public mainService: MainServiceService,
    public directMessageService: DirectMessageService,
    public loginService: LoginService
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
      if (!this.chatService.editOpen) {
        this.chatService.text += content;
      } else {
        this.chatService.editText += content;
      }
    });
    this.chatService.loggedInUser = this.mainService.loggedInUser;
  }

  /**
 * Initializes the component by fetching the current logged-in user and subscribing to changes in the user's status.
 * Upon receiving an update, it creates a new User instance and assigns it to a service for use within the application.
 * This is typically used to ensure that the component has access to the latest user information when it is initialized.
 */
  ngOnInit() {
    this.loginService.currentLoggedUser()
    this.loginService.loggedInUser$.subscribe((user) => {
      this.mainService.loggedInUser = new User(user);
    });
  }

  /**
   * A lifecycle hook that is called when the component is destroyed.
   * Used for any custom cleanup that needs to occur when the component is taken out of the DOM.
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
