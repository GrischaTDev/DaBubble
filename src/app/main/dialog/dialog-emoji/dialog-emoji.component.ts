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
    public chatService: ChatService
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
      this.chatService.addReactionToMessage(event.emoji.native);
      this.mainService.emojiReactionMessage = false;
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
