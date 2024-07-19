import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DialogEmojiComponent } from '../../dialog/dialog-emoji/dialog-emoji.component';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { MainServiceService } from '../../../service/main-service.service';
import { ChatService } from '../../../service/chat.service';
import { MobileHeaderComponent } from '../../header/mobile-header/mobile-header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {  docData } from '@angular/fire/firestore';
import { User } from '../../../../assets/models/user.class';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MobileChatHeaderComponent } from '../../header/mobile-chat-header/mobile-chat-header.component';
import { EmojiService } from '../../../service/emoji.service';
import { DirectMessageService } from '../../../service/direct-message.service';
import { UserProfileComponent } from '../../user-profile/user-profile.component';

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
  loggedInUser: User = new User();

  constructor(
    private route: ActivatedRoute, public chatService: ChatService, public mainService: MainServiceService, public emojiService: EmojiService, public directMessageService: DirectMessageService,) {
    if (this.parmsId) {
      this.items$ = docData(
        mainService.getDataRef(
          this.directMessageService.directMessageId,
          'direct-message'
        )
      );
      this.items = this.items$.subscribe((directMessage: any) => {
        this.directMessageService.dataDirectMessage = directMessage;
      });
    }
    this.directMessageService.loadDirectChatContent(this.directMessageService.directMessageId);
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
        this.directMessageService
          .loadDirectChatContent(directMessageId)
          .then(() => {
            this.directMessageService.validationOfTheOtherUser();
            this.directMessageService.checkUserStatus();
          })
          .catch((error) => {
            console.error('Fehler beim Laden des Chats:', error);
          });
      }
    });
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

    /**
   * A lifecycle hook that is called when the component is destroyed.
   * Used for any custom cleanup that needs to occur when the component is taken out of the DOM.
   */
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

}
