import { Injectable } from '@angular/core';
import { MainServiceService } from './main-service.service';
import { ChatService } from './chat.service';
import { Emoji } from '../../assets/models/emoji.class';
import { ThreadService } from './thread.service';

@Injectable({
  providedIn: 'root',
})
export class EmojiService {
  constructor(
    public mainService: MainServiceService,
    public chatService: ChatService,
    public threadService: ThreadService
  ) { }
  emojiIsAvailable = false;
  userIsAvailable = false;
  newEmoji: Emoji = new Emoji();
  additionalReaction = false;
  emojiIndex: number = 0;
  emojiToChannel: boolean = false;
  emojiToDirectMessage: boolean = false;
  emojieToThread: boolean = false;

  /**
   * Adds a reaction to a message in the current channel, updating the emoji reactions based on the user interactions.
   * It processes all current reactions for the message, searching and updating as needed, and then marks the added emoji.
   * @param {string} emoji - The emoji character to add as a reaction.
   */
  addReactionToMessageChannel(emoji: string, indexSingleMessage: number) {
    this.chatService.indexOfChannelMessage = indexSingleMessage;
    let dataEmoji = this.chatService.dataChannel.messageChannel[indexSingleMessage].emojiReaction; 
    if (dataEmoji.length !== 0) {
      this.preparedSearchUserAndEmoji(emoji, dataEmoji);
      this.selectionTheAddedEmojiChannel(emoji);
    } else {
      this.pushEmojiToArray(emoji);
      this.resetReactionVariables();
    }
  }

  /**
 * Adds a reaction to a message in the current channel, updating the emoji reactions based on the user interactions.
 * It processes all current reactions for the message, searching and updating as needed, and then marks the added emoji.
 * @param {string} emoji - The emoji character to add as a reaction.
 */
  addReactionToMessageThread(emoji: string, indexSingleMessage: number) {
    this.chatService.indexOfChannelMessage = indexSingleMessage;
    let dataEmoji = this.chatService.dataThread.messageChannel[indexSingleMessage].emojiReaction;
    if (dataEmoji.length !== 0) {
      this.preparedSearchUserAndEmoji(emoji, dataEmoji);
      this.selectionTheAddedEmojiThread(emoji);
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
    emojiIndex: number
  ) {
    this.additionalReaction = true;
    this.chatService.indexOfChannelMessage = singleMessageIndex;
    this.emojiIndex = emojiIndex;
    if (this.emojiToChannel || this.emojiToDirectMessage) {
      this.addReactionToMessageChannel(emoji, this.chatService.indexOfChannelMessage);
    } else if (this.emojieToThread) {
      this.addReactionToMessageThread(emoji, this.chatService.indexOfChannelMessage);
    }
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
  async selectionTheAddedEmojiChannel(emoji: string) {
    let arrayEmoji = this.chatService.dataChannel.messageChannel[this.chatService.indexOfChannelMessage].emojiReaction[this.emojiIndex];
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
 * Checks if the emoji is already available in the array of reactions; if not, it adds the emoji to the array.
 * @param {string} emoji - The emoji to be added or checked within the array.
 */
  async selectionTheAddedEmojiThread(emoji: string) {
    let arrayEmoji = this.chatService.dataThread.messageChannel[this.chatService.indexOfChannelMessage].emojiReaction[this.emojiIndex];
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
    if (this.emojiToChannel || this.emojiToDirectMessage) {
      this.chatService.dataChannel.messageChannel[this.chatService.indexOfChannelMessage].emojiReaction.push(this.newEmoji.toJSON());
    } else if (this.emojieToThread) {
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
          this.removeEmojie();
        }
      }
    }
  }

  /**
   * Removes an emoji reaction from a specific message in the chat.
   * This method accesses the message channel via the data channel of the chat service,
   * identifies the message by index, and removes the emoji based on its index.
   */
  removeEmojie() {
    if (this.emojiToChannel || this.emojiToDirectMessage) {
      this.chatService.dataChannel.messageChannel[
        this.chatService.indexOfChannelMessage
      ].emojiReaction.splice(this.emojiIndex, 1);
    } else if (this.emojieToThread) {
      this.chatService.dataThread.messageChannel[
        this.chatService.indexOfChannelMessage
      ].emojiReaction.splice(this.emojiIndex, 1);
    }
  }

  /**
   * Resets the reaction-related variables to false. This is typically called to clear the state before
   * processing a new reaction or at the end of an operation involving reactions.
   */
  async resetReactionVariables() {
    this.emojiIsAvailable = false;
    this.userIsAvailable = false;
    this.mainService.emojiReactionMessage = false;
    if (this.emojiToChannel || this.emojiToDirectMessage) {
      await this.mainService.setDocData('channels', this.chatService.dataChannel.id, this.chatService.dataChannel);
    } else if (this.emojieToThread) {
      await this.mainService.setDocData('threads', this.chatService.dataThread.id, this.chatService.dataThread);
    }
    this.emojiToChannel = false;
    this.emojiToDirectMessage = false;
    this.emojieToThread = false;
  }

  /**
  * Assigns emoji handling to different types of communication documents.
  * @param {string} docName - The name of the document type.
  */
  forWhichDocIsTheEmoji(docName: string) {
    if (docName === 'channels') {
      this.emojiToChannel = true;
    } else if (docName === 'direct-message') {
      this.emojiToDirectMessage = true;
    } else if (docName === 'thread') {
      this.emojieToThread = true;
    }
  }
}
