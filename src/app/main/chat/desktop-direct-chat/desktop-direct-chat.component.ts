import { Component, ElementRef, inject, ViewChild } from '@angular/core';
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
import { User } from '../../../../assets/models/user.class';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MobileChatHeaderComponent } from '../../header/mobile-chat-header/mobile-chat-header.component';
import { EmojiService } from '../../../service/emoji.service';
import { DirectMessageService } from '../../../service/direct-message.service';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { Subscription } from 'rxjs';

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
  styleUrl: './desktop-direct-chat.component.scss',
})
export class DesktopDirectChatComponent {
  public dialog = inject(MatDialog);
  dialogInstance?: MatDialogRef<DialogEmojiComponent>;
  loggedInUser: User = new User();
  parmsId: any;
  private channelSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    public chatService: ChatService,
    public mainService: MainServiceService,
    public emojiService: EmojiService,
    public directMessageService: DirectMessageService,
  ) {
    this.route.params.subscribe((params: any) => {
      this.parmsId = params.id;
      chatService.idOfChannel = params.id;
    });
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

  checkForEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.directMessageService.sendMessageFromDirectMessage(
        this.directMessageService.directMessageDocId,
        this.chatService.text
      )
    }
  }

  ngOnDestroy() {
    if (this.channelSubscription) {
      this.channelSubscription.unsubscribe();
    }
  }
}
