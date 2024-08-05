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
import { Channel } from 'diagnostics_channel';

@Component({
  selector: 'app-desktop-direct-chat',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    MobileHeaderComponent,
    CommonModule,
    PickerComponent,
    MobileChatHeaderComponent,
  ],
  templateUrl: './desktop-direct-chat.component.html',
  styleUrl: './desktop-direct-chat.component.scss'
})
export class DesktopDirectChatComponent implements OnInit {
  public dialog = inject(MatDialog);
  dialogInstance?: MatDialogRef<DialogEmojiComponent>;
  loggedInUser: User = new User();
  parmsId: any;

  constructor(
    private route: ActivatedRoute, public chatService: ChatService, public mainService: MainServiceService, public emojiService: EmojiService, public directMessageService: DirectMessageService, private loginService: LoginService,) {

      this.route.params.subscribe((params: any) => {
        this.parmsId = params.id;
        chatService.idOfChannel = params.id;
      });

  }

  /**
   * Initializes the component by subscribing to route parameters.
   * It delegates the handling of user ID from the route to another function.
   */
  ngOnInit() {
 
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
