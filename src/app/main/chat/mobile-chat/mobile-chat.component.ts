import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-mobile-chat',
  standalone: true,
  imports: [MatIconModule, FormsModule],
  templateUrl: './mobile-chat.component.html',
  styleUrl: './mobile-chat.component.scss'
})
export class MobileChatComponent {
  text = '';

  adjustHeight(eventTarget: EventTarget | null): void {
    if (eventTarget instanceof HTMLTextAreaElement) {
      const textarea = eventTarget;
      textarea.style.overflow = 'hidden';
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      window.scrollTo(0, document.body.scrollHeight);
    }
  }
}
