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
import { ActivatedRoute, ParamMap } from '@angular/router';
import { User } from '../../../../assets/models/user.class';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MobileChatHeaderComponent } from '../../header/mobile-chat-header/mobile-chat-header.component';
import { EmojiService } from '../../../service/emoji.service';
import { DirectMessageService } from '../../../service/direct-message.service';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { LoginService } from '../../../service/login.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';

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
  public dialog = inject(MatDialog);
  dialogInstance?: MatDialogRef<DialogEmojiComponent>;
  subscription;
  loggedInUser: User = new User();

  constructor(
    private route: ActivatedRoute, public chatService: ChatService, public mainService: MainServiceService, public emojiService: EmojiService, public directMessageService: DirectMessageService, private loginService: LoginService,) {
    this.directMessageService.loadDirectChatContent(this.directMessageService.directMessageId);
    this.subscription = mainService.currentContentEmoji.subscribe((content) => {
      this.chatService.text += content;
    });
  }

  /**
   * Initializes the component by subscribing to route parameters.
   * It delegates the handling of user ID from the route to another function.
   */
  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => this.handleDirectChat(params))
    ).subscribe();
  }

  /**
   * Handles loading of direct chat content based on the user ID.
   * @param {ParamMap} params - The Angular route snapshot paramMap.
   * @returns {Observable<any>} An observable that emits chat content or null.
   */
  handleDirectChat(params: ParamMap): Observable<any> {
    const userId = params.get('userId');
    if (userId) {
      return from(this.directMessageService.loadDirectChatContent(userId)).pipe(
        tap(() => {
          this.directMessageService.validationOfTheOtherUser();
          this.directMessageService.checkUserStatus();
        }),
        catchError(error => {
          console.error(error);
          return of(null);
        })
      );
    }
    return of(null);
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
