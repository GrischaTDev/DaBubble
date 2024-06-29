import { Component, inject, OnDestroy  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { DialogEmojiComponent } from '../../dialog-emoji/dialog-emoji.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MainServiceService } from '../../../service/main-service.service';

@Component({
  selector: 'app-mobile-chat',
  standalone: true,
  imports: [MatIconModule, FormsModule],
  templateUrl: './mobile-chat.component.html',
  styleUrl: './mobile-chat.component.scss'
})
export class MobileChatComponent {
  text = '';
  dialogEmoji = '';
  public dialog = inject(MatDialog);
  inputContent: string | undefined;
  subscription;

  constructor(private mainService: MainServiceService) {
    this.subscription = this.mainService.currentContentEmoji.subscribe(content => {
      this.dialogEmoji = content;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  adjustHeight(eventTarget: EventTarget | null): void {
    if (eventTarget instanceof HTMLTextAreaElement) {
      const textarea = eventTarget;
      textarea.style.overflow = 'hidden';
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      window.scrollTo(0, document.body.scrollHeight);
    }
  }

  openDialog(): void {
    this.dialog.open(DialogEmojiComponent);
  }

}
