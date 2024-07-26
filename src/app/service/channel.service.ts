import { Injectable, Input } from '@angular/core';
import { User } from '../../assets/models/user.class';
import { ChatService } from './chat.service';
import { MainServiceService } from './main-service.service';
import { Channel } from '../../assets/models/channel.class';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  @Input() content: string = '';
  @Input() placeholder: string = 'Name eingeben';
  addUserClicked = false;
  addetUser: User[] = [];
  filteredUsers: User[] = [];
  isEmpty: boolean = true;
  textareaHeight: number = 37;
  editUserList: User[] = [];
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
    }
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
* Closes the current dialog and updates the state to indicate that adding a user is no longer in progress.
* This method is used to handle the closing of dialog interfaces within the application.
*/
  closeDialogAddUser() {
    this.chatService.closeDialog();
    this.addUserClicked = false;
  }
}
