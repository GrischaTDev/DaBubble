import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ChatService } from '../../../service/chat.service';
import { User } from '../../../../assets/models/user.class';
import { MainServiceService } from '../../../service/main-service.service';

@Component({
  selector: 'app-dialog-add-user',
  standalone: true,
  imports: [MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    CommonModule,
    MatIconModule,
    FormsModule],
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss'
})
export class DialogAddUserComponent {
  @Input() content: string = '';
  @Input() placeholder: string = 'Name eingeben';
  @Output() contentChange = new EventEmitter<string>();
  @ViewChild('container') container!: ElementRef;
  addUserClicked = false;
  addetUser: User[] = [];
  filteredUsers: User[] = [];
  isEmpty: boolean = true;

  constructor(
    public chatService: ChatService,
    public mainService: MainServiceService,
    private cdr: ChangeDetectorRef
  ) {
    this.chatService = chatService;
  }

  ngOnInit() {
    this.updateIsEmpty();
    if (this.isEmpty) {
      this.content = this.placeholder;
    }
  }

  openSearchUser() {
    this.addUserClicked = true;
    this.cdr.detectChanges();
  }

  closeDialog() {
    this.chatService.closeDialog()
    this.addUserClicked = false;
  }

  closePeopleSearch() {
    this.addUserClicked = false;
  }

  updateContent(event: Event) {
    this.content = (event.target as HTMLElement).innerHTML;
    const htmlElement = event.target as HTMLElement;
    const content = htmlElement.innerText.trim();
    this.updateIsEmpty(content);
    this.filterUserContent(content)
    if (!this.isEmpty) {
      this.contentChange.emit(content);
    }
  }

  updateIsEmpty(content?: string) {
    this.isEmpty = !content || content === this.placeholder;
  }

  @HostListener('focusin')
  onFocusIn() {
    if (this.isEmpty) {
      this.content = '';
    }
  }

  @HostListener('focusout')
  onFocusOut() {
    if (this.isEmpty) {
      this.content = this.placeholder;
    } else {
      this.contentChange.emit(this.content);
    }
  }

  filterUserContent(content: string) {
    this.filteredUsers = [];
    this.filteredUsers = this.mainService.allUsers.filter(user => {
      const userNameLower = user.name.toLowerCase();
      const contentLower = content.toLowerCase();
      const match = userNameLower.includes(contentLower);
      return match;
    });
  }

  pushAddetUser(userFilter: User) {
    this.addetUser.push(userFilter);
  }
}
