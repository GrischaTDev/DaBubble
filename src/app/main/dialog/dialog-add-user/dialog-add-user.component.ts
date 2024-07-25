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
import { Channel } from '../../../../assets/models/channel.class';

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
  textareaHeight: number = 37;
  editUserList: User[] = [];

  constructor(
    public chatService: ChatService,
    public mainService: MainServiceService,
    private cdr: ChangeDetectorRef
  ) {
    this.chatService = chatService;
    this.pushUserToEditList();
  }

  /**
 * Initializes the component by checking if it is empty. If it is, sets the content to a placeholder.
 * This method is called once during the component's lifecycle, when the component is being initialized.
 */
  ngOnInit() {
    this.updateIsEmpty();
    if (this.isEmpty) {
      this.content = this.placeholder;
    }
  }

  /**
 * Activates the user search interface and triggers change detection.
 * This method is called when the user initiates a search for adding a new user.
 */
  openSearchUser() {
    this.addUserClicked = true;
    this.cdr.detectChanges();
  }

  /**
 * Closes the current dialog and updates the state to indicate that adding a user is no longer in progress.
 * This method is used to handle the closing of dialog interfaces within the application.
 */
  closeDialog() {
    this.chatService.closeDialog();
    this.addUserClicked = false;
  }

  /**
 * Resets the search state and clears the user addition UI. Sets the textarea height, clears the content,
 * empties the added user list, updates the user edit list, and marks the component as empty and inactive for adding users.
 */
  closePeopleSearch() {
    this.textareaHeight = 37;
    this.content = '';
    this.addetUser = [];
    this.pushUserToEditList();
    this.isEmpty = true;
    this.addUserClicked = false;
  }

  /**
 * Populates the edit user list with users from the main user list, excluding the currently logged-in user.
 * This method is typically used to prepare a list of users that can be edited or managed in the UI.
 */
  pushUserToEditList() {
    for (let index = 0; index < this.mainService.allUsers.length; index++) {
      const user = this.mainService.allUsers[index];
      if (user.id !== this.mainService.loggedInUser.id) {
        this.editUserList.push(new User(user));
      }
    }
  }

  /**
* Updates the content based on user input, filters user-related content, and emits an event if the content is not empty.
* @param {Event} [event] - Optional event parameter that can be used to pass event data.
*/
  updateContent(event?: Event): void {
    this.updateIsEmpty(this.content);
    this.filterUserContent(this.content);
    if (!this.isEmpty) {
      this.contentChange.emit(this.content);
    }
  }

  /**
 * Updates the `isEmpty` state of the content based on its presence or if it matches the placeholder.
 * @param {string} [content] - Optional content string to check against the placeholder for emptiness.
 */
  updateIsEmpty(content?: string) {
    this.isEmpty = !content || content === this.placeholder;
  }

  /**
 * Clears the content if it is empty when the component gains focus.
 * This method responds to the `focusin` event to manage content initialization.
 */
  @HostListener('focusin')
  onFocusIn() {
    if (this.isEmpty) {
      this.content = '';
    }
  }

  /**
 * Sets the content to a placeholder if it is empty or emits the current content if not, when the component loses focus.
 * This method responds to the `focusout` event to ensure the content is appropriately managed when focus is lost.
 */
  @HostListener('focusout')
  onFocusOut() {
    if (this.isEmpty) {
      this.content = this.placeholder;
    } else {
      this.contentChange.emit(this.content);
    }
  }

  /**
 * Filters users based on the provided content, updating the list of filtered users.
 * Users are filtered by checking if the user's name includes the provided content (case insensitive).
 * @param {string} content - The string content used to filter the user names.
 */
  filterUserContent(content: string) {
    this.filteredUsers = [];
    this.filteredUsers = this.editUserList.filter(user => {
      const userNameLower = user.name.toLowerCase();
      const contentLower = content.toLowerCase();
      const match = userNameLower.includes(contentLower);
      return match;
    });
  }

  /**
* Adds a selected user to the added users list, removes them from the edit list, and clears the content.
* It also updates the component state and UI, such as checking if the content is empty and adjusting the contenteditable element's height.
* @param {User} userFilter - The user object to add to the added users list.
* @param {number} indexFilterUser - The index of the user in the edit user list to remove.
* @param {Event} event - The event object, typically from a user interaction.
*/
  pushAddetUser(userFilter: User, indexFilterUser: number, event: Event) {
    this.editUserList.splice(indexFilterUser, 1);
    this.addetUser.push(userFilter);
    this.content = '';
    this.updateContent(event);
    this.updateIsEmpty(this.content);
    this.filterUserContent(this.content);
    if (!this.isEmpty) {
      this.contentChange.emit(this.content);
    }
    const editableDiv = document.querySelector('[contenteditable="true"]');
    if (editableDiv) editableDiv.innerHTML = '';
    this.calculateHeight();
  }

  /**
 * Increases the height of the textarea by a set increment and triggers change detection to update the view.
 * This method is typically used to adjust the layout dynamically based on content or interaction changes.
 */
  calculateHeight() {
    this.textareaHeight = this.textareaHeight + 37
    this.cdr.detectChanges();
  }

  /**
 * Removes a user from the added users list, adds them back to the editable user list, and adjusts the textarea height.
 * This method manages user lists dynamically and updates the UI correspondingly when a user is removed.
 * @param {User} deletUser - The user to be removed from the added users list and added back to the editable list.
 * @param {number} indexAddUser - The index of the user in the added users list to be removed.
 */
  removeAddUser(deletUser: User, indexAddUser: number) {
    this.editUserList.push(deletUser);
    this.addetUser.splice(indexAddUser, 1);
    this.textareaHeight = this.textareaHeight - 37;
    this.cdr.detectChanges();
  }

  /**
 * Adds each user from the added users list to the current channel and updates the channel's document in the database.
 * After adding users to the channel, it resets and closes the user search interface.
 * This method is typically used when new users are confirmed to be added to a channel.
 */
  pushNewUserToChannel() {
    for (let index = 0; index < this.addetUser.length; index++) {
      const user = this.addetUser[index];
      this.chatService.dataChannel.channelUsers.push(new User(user));
    }
    this.mainService.addDoc('channels', this.chatService.idOfChannel, new Channel(this.chatService.dataChannel));
    this.closePeopleSearch();
  }
}
