import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DialogEmojiComponent } from '../../dialog-emoji/dialog-emoji.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MainServiceService } from '../../../service/main-service.service';

@Component({
  selector: 'app-mobile-chat',
  standalone: true,
  imports: [MatIconModule, FormsModule],
  templateUrl: './mobile-chat.component.html',
  styleUrl: './mobile-chat.component.scss',
})
export class MobileChatComponent {
  text = '';
  public dialog = inject(MatDialog);
  dialogInstance?: MatDialogRef<DialogEmojiComponent>;
  subscription;
  dialogOpen = false;

  constructor(public mainService: MainServiceService) {
    this.subscription = this.mainService.currentContentEmoji.subscribe(
      (content) => {
        this.text += content;
      }
    );
  }

  /**
   * Adjusts the height of a textarea to fit its content without scrolling.
   * This function sets the textarea's overflow to hidden and height to the scrollHeight of the textarea,
   * ensuring that the textarea fully displays all its content without needing an internal scrollbar.
   * @param {EventTarget | null} eventTarget - The target of the event, expected to be a textarea element, or null.
   */
  adjustHeight(eventTarget: EventTarget | null): void {
    if (eventTarget instanceof HTMLTextAreaElement) {
      const textarea = eventTarget;
      textarea.style.overflow = 'hidden';
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      window.scrollTo(0, document.body.scrollHeight);
    }
  }

  /**
   * Toggles the visibility of a dialog window.
   * If the dialog is not currently open, it opens a new dialog with a specified width.
   * If the dialog is already open, it triggers the dialog to close.
   */
  openDialog(): void {
    if (!this.dialogOpen) {
      this.dialogInstance = this.dialog.open(DialogEmojiComponent, {
        width: '250px',
      });
      this.dialogOpen = true;
    } else {
      this.closeDialog();
    }
  }

  /**
   * Handles the emoji button click event.
   * Prevents the event from propagating to parent elements.
   *
   * @param {MouseEvent} event - The mouse event triggered by clicking the emoji button.
   */
  onEmojiButtonClick(event: MouseEvent): void {
    event.stopPropagation(); // Stoppt die Übertragung des Events zum Elternelement
  }

  /**
   * Closes the dialog if it is currently open.
   * Logs the attempt and the result of the dialog closure.
   */
  closeDialog(): void {
    console.log('Versuche den Dialog zu schließen');
    if (this.dialogInstance) {
      this.dialogInstance.close();
      console.log('Dialog geschlossen');
      this.dialogOpen = false;
    }
  }

  /**
   * A lifecycle hook that is called when the component is destroyed.
   * Used for any custom cleanup that needs to occur when the component is taken out of the DOM.
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
