import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MainServiceService } from '../../service/main-service.service';

@Component({
  selector: 'app-dialog-emoji',
  standalone: true,
  imports: [PickerComponent],
  templateUrl: './dialog-emoji.component.html',
  styleUrl: './dialog-emoji.component.scss',
})
export class DialogEmojiComponent {
  public dialogRef = inject(MatDialogRef<DialogEmojiComponent>);
  constructor(private mainService: MainServiceService) {}
  inputContent = '';

  addEmoji(event: any) {
    this.inputContent += event.emoji.native;
    this.mainService.changeContentEmoji(this.inputContent);
    console.log(this.inputContent);
  }
}
