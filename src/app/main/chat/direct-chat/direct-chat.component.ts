import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    MobileHeaderComponent,
    CommonModule,
    PickerComponent,
  ],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss'
})
export class DirectChatComponent {
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

  constructor(
    private route: ActivatedRoute,
    public chatService: ChatService,
    public mainService: MainServiceService
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

  directChatUser = this.mainService.loggedInUser;

  /**
   * A lifecycle hook that is called when the component is destroyed.
   * Used for any custom cleanup that needs to occur when the component is taken out of the DOM.
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
