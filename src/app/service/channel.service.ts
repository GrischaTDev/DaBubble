import { inject, Injectable, Input } from '@angular/core';
import { User } from '../../assets/models/user.class';
import { ChatService } from './chat.service';
import { MainServiceService } from './main-service.service';
import { Channel } from '../../assets/models/channel.class';
import { DialogEditChannelComponent } from '../main/dialog/dialog-edit-channel/dialog-edit-channel.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  @Input() content: string = '';
  @Input() textareaChannelName: string = '';
  @Input() textareaChannelDescription: string = '';

  @Input() placeholder: string = 'Name eingeben';
  addUserClicked = false;
  addetUser: User[] = [];
  filteredUsers: User[] = [];
  usersNotYetAdded: User[] = [];
  isEmpty: boolean = true;
  isChannelNameEmpty: boolean = true;
  isChannelDescriptionEmpty: boolean = true;
  textareaHeight: number = 37;
  filterContentMarginTop: number = 0;
  editUserList: User[] = [];
  public dialog = inject(MatDialog);
  dialogInstance: MatDialogRef<DialogEditChannelComponent, any> | undefined;
  editChannelNameIsOpen: boolean = false;
  editChannelDescriptionIsOpen: boolean = false;
  editChannelAddUserIsOpen: boolean = false;
  textName: string = '';
  textDescription: string = '';

  constructor(public chatService: ChatService,
    public mainService: MainServiceService,) { }

  /**
* Adds each user from the added users list to the current channel and updates the channel's document in the database.
* After adding users to the channel, it resets and closes the user search interface.
* This method is typically used when new users are confirmed to be added to a channel.
*/
  pushNewUserToChannel() {
    if (this.addetUser.length !== 0) {
      for (let index = 0; index < this.addetUser.length; index++) {
        const user = this.addetUser[index];
        this.chatService.dataChannel.channelUsers.push(new User(user));
      }
      this.mainService.addDoc('channels', this.chatService.idOfChannel, new Channel(this.chatService.dataChannel));
      this.closePeopleSearch();
      this.editChannelAddUserIsOpen = false;
    }
  }

  /**
* Resets the search state and clears the user addition UI. Sets the textarea height, clears the content,
* empties the added user list, updates the user edit list, and marks the component as empty and inactive for adding users.
*/
  closePeopleSearch() {
    this.resetArrays();
    this.textareaHeight = 37;
    this.filterContentMarginTop = 0;
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
    this.editUserList.splice(0, this.editUserList.length);
    for (let index = 0; index < this.mainService.allUsers.length; index++) {
      const user = this.mainService.allUsers[index];
      if (user.id !== this.mainService.loggedInUser.id) {
        this.editUserList.push(new User(user));
      }
    }
  }

  /**
* Filters users based on the provided content, updating the list of filtered users.
* Users are filtered by checking if the user's name includes the provided content (case insensitive).
* @param {string} content - The string content used to filter the user names.
*/
  filterUserContent(content: string) {
    this.resetArrays();
    this.filteredUsers = this.editUserList.filter(user => {
      const userNameLower = user.name.toLowerCase();
      const contentLower = content.toLowerCase();
      const match = userNameLower.includes(contentLower);
      return match;
    });
    this.removeExistingUsers();
  }

  removeExistingUsers() {
    const channelUserIds = this.chatService.dataChannel.channelUsers.map(user => user.id);
    const ownerId = this.chatService.dataChannel.ownerUser.map(user => user.id);
    const addedUserId = this.addetUser.map(user => user.id);
    this.filteredUsers.forEach(user => {
      if (!channelUserIds.includes(user.id) && !ownerId.includes(user.id) && !addedUserId.includes(user.id)) {
        this.usersNotYetAdded.push(new User(user));
      }
    });
  }

  clearInput() {
    this.content = '';
    this.isEmpty = true;
  }

  resetArrays() {
    this.filteredUsers.splice(0, this.filteredUsers.length);
    this.usersNotYetAdded.splice(0, this.usersNotYetAdded.length);
  }

  /**
* Closes the current dialog and updates the state to indicate that adding a user is no longer in progress.
* This method is used to handle the closing of dialog interfaces within the application.
*/
  closeDialogAddUser() {
    this.chatService.closeDialog();
    this.addUserClicked = false;
  }

  openEditDialog() {
    this.dialogInstance = this.dialog.open(DialogEditChannelComponent);
  }

  closeEditChannelDialog() {
    if (this.dialogInstance) {
      this.dialogInstance.close()
    }
    this.editChannelNameIsOpen = false;
  }

  editChannelName() {
    this.editChannelNameIsOpen = true;
  }

  async saveChannelName() {
    if (!this.isChannelNameEmpty) {
      this.chatService.dataChannel.name = this.textareaChannelName;
      await this.mainService.addDoc('channels', this.chatService.idOfChannel, new Channel(this.chatService.dataChannel));
    }
    this.editChannelNameIsOpen = false;
  }

  editChannelDescription() {
    this.editChannelDescriptionIsOpen = true;
  }

  async saveChannelDescription() {
    console.log('this.isEmpty', this.isEmpty)
    if (!this.isChannelDescriptionEmpty) {
      this.chatService.dataChannel.description = this.textareaChannelDescription;
      await this.mainService.addDoc('channels', this.chatService.idOfChannel, new Channel(this.chatService.dataChannel));
    }
    this.editChannelDescriptionIsOpen = false;
  }

  editChannelAddUserOpen() {
    this.editChannelAddUserIsOpen = true;
  }

  editChannelAddUserClose() {
    this.editChannelAddUserIsOpen = false;
  }
}
