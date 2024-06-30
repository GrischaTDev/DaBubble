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
  constructor(private mainService: MainServiceService) {}
  inputContent = '';

  /**
   * Adds an emoji to the input content and updates the main service with the new content.
   * @param {any} event - The event object containing the emoji data.
   */
  addEmoji(event: any) {
    this.inputContent = ' ' + event.emoji.native;
    this.mainService.changeContentEmoji(this.inputContent);
    this.dialogRef.close();
  }

  /**
   * Closes the currently open dialog.
   * @method closeDialog
   */
  closeDialog() {
    this.dialogRef.close();
  }
}