import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MobileChatHeaderComponent } from '../../header/mobile-chat-header/mobile-chat-header.component';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../service/chat.service';
import { ThreadService } from '../../../service/thread.service';
import { EmojiService } from '../../../service/emoji.service';
import { CommonModule } from '@angular/common';
import { AddChannelComponent } from '../../channels/add-channel/add-channel.component';
import { NewMessageComponent } from '../../new-message/mobile-new-message/new-message.component';
import { DirectChatComponent } from '../../chat/direct-chat/direct-chat.component';
import { DirectMessageService } from '../../../service/direct-message.service';
import { MainServiceService } from '../../../service/main-service.service';
import { Channel } from '../../../../assets/models/channel.class';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mobile-thread',
  standalone: true,
  imports: [
    MobileChatHeaderComponent,
    MatIcon,
    FormsModule,
    CommonModule, MatIconModule, AddChannelComponent, NewMessageComponent, DirectChatComponent
  ],
  templateUrl: './mobile-thread.component.html',
  styleUrl: './mobile-thread.component.scss'
})
export class MobileThreadComponent implements OnInit {
  parmsId1: string = '';
  parmsId2: string = '';

  constructor(private route: ActivatedRoute, private router: Router, public mainService: MainServiceService, public chatService: ChatService, public threadService: ThreadService, public emojiService: EmojiService, public directMessageService: DirectMessageService) {
    this.route.params.subscribe((params: any) => {
      this.parmsId1 = params['id1'];
      this.parmsId2 = params['id2'];
    });
  }

  /**
  * Initializes the component by fetching the current logged-in user and subscribing to changes in the user's status.
  * Upon receiving an update, it creates a new User instance and assigns it to a service for use within the application.
  * This is typically used to ensure that the component has access to the latest user information when it is initialized.
  */
  ngOnInit() {
    this.mainService.watchSingleChannelDoc(this.parmsId1, 'channels').subscribe(dataChannel => {
      this.chatService.dataChannel = dataChannel as Channel;
    }); 
    this.mainService.watchSingleDirectMessageDocThread(this.parmsId2, 'threads').subscribe(dataThread => {
      this.chatService.dataThread = dataThread as Channel;
    }); 
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
  }

  /**
  * Handles window resize events by checking if the screen size exceeds a specific width.
  * This method is triggered whenever the window is resized.
  */
  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize(window.innerWidth);
  }

  /**
  * Redirects to the main page if the screen width exceeds 960 pixels.
  * @param {number} width - The current width of the screen.
  */
  private checkScreenSize(width: number) {
    if (width > 960) {
      this.router.navigate(['/main', 'chat', this.chatService.dataChannel.id, 'user']);
      this.chatService.mobileChatIsOpen = false;
      this.chatService.mobileDirectChatIsOpen = false
      this.chatService.mobileThreadIsOpen = false;
    } 
  }

  /** @ViewChild decorator to access the scrollable container element within a thread. */
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
      this.scrollContainer.nativeElement.scrollHeight > this.lastScrollHeight && this.chatService.sendetMessage
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
 * Navigates to a specified thread by ID.
 * This method subscribes to a single thread document from a service, updates the chat service's data thread, 
 * and then navigates to the thread page using the router.
 */
 navigateToChat() {
    this.router.navigate(['/main', 'chat', this.chatService.dataThread.idOfChannelOnThred, 'user', 'chat']);
  }
}
