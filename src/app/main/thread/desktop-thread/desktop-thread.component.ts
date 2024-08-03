import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { MainServiceService } from '../../../service/main-service.service';
import { LoginService } from '../../../service/login.service';
import { ChatService } from '../../../service/chat.service';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DialogEmojiComponent } from '../../dialog/dialog-emoji/dialog-emoji.component';
import { User } from '../../../../assets/models/user.class';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { DirectMessageService } from '../../../service/direct-message.service';
import { ChannelService } from '../../../service/channel.service';
import { CommonModule } from '@angular/common';
import { EmojiService } from '../../../service/emoji.service';
import { ThreadService } from '../../../service/thread.service';
import { Channel } from '../../../../assets/models/channel.class';


@Component({
  selector: 'app-desktop-thread',
  standalone: true,
  imports: [
    FormsModule,
    MatIcon,
    CommonModule
  ],
  templateUrl: './desktop-thread.component.html',
  styleUrl: './desktop-thread.component.scss'
})
export class DesktopThreadComponent {
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
    public channelService: ChannelService,
    public loginService: LoginService,
    public threadService: ThreadService
  ) {
    this.subscription = mainService.currentContentEmoji.subscribe((content) => {
      if (!this.chatService.editOpen) {
        this.chatService.text += content;
      } else {
        this.chatService.editText += content;
      }
    });
        this.route.params.subscribe((params: any) => {
      this.parmsId = params.id;
      chatService.idOfChannel = params.id;
    });
    this.chatService.loggedInUser = this.mainService.loggedInUser;
  }

  /**
 * Initializes the component by fetching the current logged-in user and subscribing to changes in the user's status.
 * Upon receiving an update, it creates a new User instance and assigns it to a service for use within the application.
 * This is typically used to ensure that the component has access to the latest user information when it is initialized.
 */
  ngOnInit() {
    this.loginService.currentLoggedUser();
    this.loginService.loggedInUser$.subscribe((user) => {
      this.mainService.loggedInUser = new User(user);
    });
  }

  @ViewChild('scrollContainerThread') private scrollContainer!: ElementRef;
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
}

