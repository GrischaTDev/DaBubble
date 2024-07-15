import { Component, inject } from '@angular/core';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MainServiceService } from '../../../service/main-service.service';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ChatService } from '../../../service/chat.service';
import { EmojiService } from '../../../service/emoji.service';

@Component({
  selector: 'app-dialog-emoji',
  standalone: true,
  imports: [
    PickerComponent,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,

  ],
  templateUrl: './dialog-emoji.component.html',
  styleUrl: './dialog-emoji.component.scss',
})
export class DialogEmojiComponent {
  public dialogRef = inject(MatDialogRef<DialogEmojiComponent>);
  constructor(
    public mainService: MainServiceService,
    public chatService: ChatService,
    public emojiService: EmojiService
  ) {}
  inputContent: any;

  /**
   * Adds an emoji to the input content and updates the main service with the new content.
   * @param {any} event - The event object containing the emoji data.
   */
  addEmoji(event: any) {
    if (!this.mainService.emojiReactionMessage) {
      this.inputContent = ' ' + event.emoji.native;
      this.mainService.changeInputContent(this.inputContent);
    } else {
      this.emojiService.addReactionToMessage(event.emoji.native);
      this.mainService.changeReactionContent(event.emoji.native);
    }
    this.chatService.closeDialog();
  }

  /**
   * Closes the currently open dialog.
   * @method closeDialog
   */
  closeDialog() {
    this.dialogRef.close();
  }
}
