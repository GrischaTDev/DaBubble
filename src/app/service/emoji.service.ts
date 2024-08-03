import { Injectable } from '@angular/core';
import { MainServiceService } from './main-service.service';
import { ChatService } from './chat.service';
import { Emoji } from '../../assets/models/emoji.class';

@Injectable({
  providedIn: 'root',
})
export class EmojiService {
  constructor(
    public mainService: MainServiceService,
    public chatService: ChatService
  ) { }
  emojiIsAvailable = false;
  userIsAvailable = false;
  newEmoji: Emoji = new Emoji();
  additionalReaction = false;
  emojiIndex: number = 0;
  docNameFromEmoji: string = '';

  /**
   * Adds a reaction to a message in the current channel, updating the emoji reactions based on the user interactions.
   * It processes all current reactions for the message, searching and updating as needed, and then marks the added emoji.
   * @param {string} emoji - The emoji character to add as a reaction.
   */
  addReactionToMessage(emoji: string, index: number, docNameEmoji: string) {
    this.chatService.indexOfChannelMessage = index;
    this.docNameFromEmoji = docNameEmoji;
    let data =
      this.chatService.dataChannel.messageChannel[this.chatService.indexOfChannelMessage].emojiReaction;
    if (data.length !== 0) {
      this.preparedSearchUserAndEmoji(emoji, data);
      this.selectionTheAddedEmoji(emoji);

    } else {
      this.pushEmojiToArray(emoji);
      this.resetReactionVariables();
    }
  }

  /**
   * Prepares and initiates a search through existing emoji reactions to find specific user and emoji matches.
   * Calls a function to handle each individual search iteration.
   * @param {string} emoji - The emoji to search for within the reactions.
   */
  preparedSearchUserAndEmoji(
    emoji: string,
    data: { emoji: string; user: string[] }[]
  ) {
    for (let index = 0; index < data.length; index++) {
      const emojiFb = data[index].emoji;
      const userFb = data[index].user;
      this.searchUserAndEmoji(emoji, emojiFb, userFb);
    }
  }

  /**
   * Flags that an additional reaction is being added and calls the method to add a reaction to a message.
   * @param {string} emoji - The emoji to add as a reaction.
   */
  addAdditionalReactionToMessage(
    emoji: string,
    singleMessageIndex: number,
    docNameEmoji: string,
    emojiIndex: number
  ) {
    this.docNameFromEmoji = docNameEmoji;
    this.additionalReaction = true;
    this.chatService.indexOfChannelMessage = singleMessageIndex;
    this.emojiIndex = emojiIndex;
    this.addReactionToMessage(emoji, this.chatService.indexOfChannelMessage, this.docNameFromEmoji);
  }

  /**
   * Searches through a list of users associated with a specific emoji reaction to check for specific conditions.
   * It sets flags if the current logged-in user has already reacted with the emoji or if the emoji is present.
   * @param {string} emoji - The emoji to search for.
   * @param {string} emojiFb - The emoji from the feedback (existing emoji reactions).
   * @param {string[]} userFb - Array of user IDs who have reacted with emojiFb.
   */
  searchUserAndEmoji(emoji: string, emojiFb: string, userFb: string[]) {
    for (let index = 0; index < userFb.length; index++) {
      const user = userFb[index];
      if (emoji === emojiFb && user === this.mainService.loggedInUser.id) {
        this.emojiIsAvailable = true;
        this.userIsAvailable = true;
      } else if (emoji === emojiFb && user !== this.mainService.loggedInUser.id) {
        this.emojiIsAvailable = true;
      } else if (emoji !== emojiFb && user === this.mainService.loggedInUser.id) {
        this.userIsAvailable = true;
      }
    }
  }

  /**
   * Checks if the emoji is already available in the array of reactions; if not, it adds the emoji to the array.
   * @param {string} emoji - The emoji to be added or checked within the array.
   */
  selectionTheAddedEmoji(emoji: string) {
    let arrayEmoji =
      this.chatService.dataChannel.messageChannel[this.chatService.indexOfChannelMessage].emojiReaction[this.emojiIndex];
      if (!this.userIsAvailable && !this.emojiIsAvailable) {
      this.pushEmojiToArray(emoji);
    } else if (!this.userIsAvailable && this.emojiIsAvailable) {
      this.pushUserToArray(arrayEmoji);
    } else if (this.userIsAvailable && this.emojiIsAvailable) {
      if (!this.mainService.emojiReactionMessage) {
        this.removeUserFromEmoji(arrayEmoji);
      }
    } else {
      this.pushEmojiToArray(emoji);
    }
    this.resetReactionVariables();
  }

  /**
  * Adds a new emoji reaction to the current message channel.
  * This method first resets the existing emoji data arrays, sets the new emoji, 
  * and then records the reacting user's ID, name, and avatar. It finally pushes 
  * the updated emoji data to the appropriate message channel's emoji reactions.
  *
  * @param {string} emoji - The emoji character or string to be added to the message.
  */
  pushEmojiToArray(emoji: string) {
    this.resetEmojiArray();
    this.newEmoji.emoji = emoji;
    this.newEmoji.user.push(this.mainService.loggedInUser.id);
    this.newEmoji.userName.push(this.mainService.loggedInUser.name);
    this.newEmoji.userAvatar.push(this.mainService.loggedInUser.avatar);
    if (this.docNameFromEmoji === 'channels' || this.docNameFromEmoji === 'direct-message') {
      this.chatService.dataChannel.messageChannel[this.chatService.indexOfChannelMessage].emojiReaction.push(this.newEmoji.toJSON());
    } else if (this.docNameFromEmoji === 'threads') {
      this.chatService.dataThread.messageChannel[this.chatService.indexOfChannelMessage].emojiReaction.push(this.newEmoji.toJSON());
    } 
  }

  /**
  * Resets the emoji arrays for a user.
  * Clears all existing emoji data by emptying the arrays that hold user emojis,
  * user names, and user avatars. This method is typically used when initializing
  * or reinitializing user data in the emoji handling system.
  */
  resetEmojiArray() {
    this.newEmoji.user = [];
    this.newEmoji.userName = [];
    this.newEmoji.userAvatar = [];
  }

  /**
   * Adds the current logged-in user's ID to the user array of a specific emoji reaction in a message.
   * Updates the document data in Firestore for the channel with the updated reactions.
   * @param {string} emoji - The emoji associated with the reaction to which the user ID is added.
   */
  pushUserToArray(arrayEmoji: any) {
    arrayEmoji.user.push(this.mainService.loggedInUser.id);
    arrayEmoji.userName.push(this.mainService.loggedInUser.name);
    arrayEmoji.userAvatar.push(this.mainService.loggedInUser.avatar);
  }

  /**
  * Removes the logged-in user from the specified emoji object.
  * It updates the emoji object by removing user ID, userName, and userAvatar from their respective arrays.
  * If there are no users left in the emoji object, it calls `removeEmijie`.
  *
  * @param {Object} arrayEmoji - The emoji object containing arrays of user IDs, user names, and user avatars.
  */
  removeUserFromEmoji(arrayEmoji: any) {
    for (let index = 0; index < arrayEmoji.user.length; index++) {
      const user = arrayEmoji.user[index];
      if (user === this.mainService.loggedInUser.id) {
        this.emojiIndex = index;
        arrayEmoji.user.splice(index, 1);
        arrayEmoji.userName.splice(index, 1);
        arrayEmoji.userAvatar.splice(index, 1);
        if (arrayEmoji.user !== 0) {
        } else {
          this.removeEmijie();
        }
      }
    }
  }

  /**
   * Removes an emoji reaction from a specific message in the chat.
   * This method accesses the message channel via the data channel of the chat service,
   * identifies the message by index, and removes the emoji based on its index.
   */
  removeEmijie() {
    this.chatService.dataChannel.messageChannel[
      this.chatService.indexOfChannelMessage
    ].emojiReaction.splice(this.emojiIndex, 1);
  }

  /**
   * Resets the reaction-related variables to false. This is typically called to clear the state before
   * processing a new reaction or at the end of an operation involving reactions.
   */
  resetReactionVariables() {
    this.emojiIsAvailable = false;
    this.userIsAvailable = false;
    this.mainService.emojiReactionMessage = false;
    this.mainService.setDocData('channels', this.chatService.dataChannel.id, this.chatService.dataChannel);
  }
}
