import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DialogEmojiComponent } from '../../dialog/dialog-emoji/dialog-emoji.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MainServiceService } from '../../../service/main-service.service';
import { ChatService } from '../chat.service';
import { MobileHeaderComponent } from '../../header/mobile-header/mobile-header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { docData } from '@angular/fire/firestore';

@Component({
  selector: 'app-mobile-chat',
  standalone: true,
  imports: [MatIconModule, FormsModule, MobileHeaderComponent, CommonModule],
  templateUrl: './mobile-chat.component.html',
  styleUrl: './mobile-chat.component.scss',
})
export class MobileChatComponent {
  items$;
  items;
  parmsId: string = '';
  text: string = '';
  public dialog = inject(MatDialog);
  dialogInstance?: MatDialogRef<DialogEmojiComponent>;
  subscription;
  dialogOpen = false;

  constructor(
    private route: ActivatedRoute,
    public chatService: ChatService,
    mainService: MainServiceService
  ) {
    this.route.params.subscribe((params: any) => {
      this.parmsId = params.id;
    });
    this.items$ = docData(mainService.getDataRef(this.parmsId, 'channels'));
    this.items = this.items$.subscribe((channel: any) => {
      this.chatService.dataChannel = channel;
    });
    this.subscription = mainService.currentContentEmoji.subscribe((content) => {
      this.text += content;
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
