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
  ) {}
  emojiIsAvailable = false;
  userIsAvailable = false;
  newEmoji: Emoji = new Emoji();
  additionalReaction = false;
  emojiIndex: number = 0;

  /**
   * Adds a reaction to a message in the current channel, updating the emoji reactions based on the user interactions.
   * It processes all current reactions for the message, searching and updating as needed, and then marks the added emoji.
   * @param {string} emoji - The emoji character to add as a reaction.
   */
  async addReactionToMessage(emoji: string) {
    await this.preparedSearchUserAndEmoji(emoji);
    this.selectionTheAddedEmoji(emoji);
  }

  /**
   * Prepares and initiates a search through existing emoji reactions to find specific user and emoji matches.
   * Calls a function to handle each individual search iteration.
   * @param {string} emoji - The emoji to search for within the reactions.
   */
  preparedSearchUserAndEmoji(emoji: string) {
    let data =
      this.chatService.dataChannel.messageChannel[
        this.chatService.indexOfChannelMessage
      ].emojiReaction;
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
    this.addReactionToMessage(emoji);
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
      } else if (
        emoji === emojiFb &&
        user !== this.mainService.loggedInUser.id
      ) {
        this.emojiIsAvailable = true;
      } else if (
        emoji !== emojiFb &&
        user === this.mainService.loggedInUser.id
      ) {
        this.userIsAvailable = true;
      }
    }
  }

  /**
   * Checks if the emoji is already available in the array of reactions; if not, it adds the emoji to the array.
   * @param {string} emoji - The emoji to be added or checked within the array.
   */
  selectionTheAddedEmoji(emoji: string) {
    let usersFromEmoji =
      this.chatService.dataChannel.messageChannel[
        this.chatService.indexOfChannelMessage
      ].emojiReaction[this.emojiIndex].user;
    if (!this.userIsAvailable && !this.emojiIsAvailable) {
      this.pushEmojiToArray(emoji);
    } else if (!this.userIsAvailable && this.emojiIsAvailable) {
      this.pushUserToArray(usersFromEmoji);
    } else if (this.userIsAvailable && this.emojiIsAvailable) {
      if (!this.mainService.emojiReactionMessage) {
        this.removeUserFromEmoji(usersFromEmoji);
      }
    }
    this.resetReactionVariables();
  }

  /**
   * Adds a new emoji to the array of emoji reactions for the current message in the channel.
   * Initializes a new reaction entry with the emoji and adds the logged-in user as the first reactor.
   * Updates the channel's document data with the new reaction list and resets availability flags.
   * @param {string} emoji - The emoji to be added to the reaction array.
   */
  pushEmojiToArray(emoji: string) {
    this.newEmoji.emoji = emoji;
    this.newEmoji.user = [];
    this.newEmoji.user.push(this.mainService.loggedInUser.id);
    this.chatService.dataChannel.messageChannel[
      this.chatService.indexOfChannelMessage
    ].emojiReaction.push(this.newEmoji.toJSON());
    this.mainService.setDocData(
      'channels',
      this.chatService.idOfChannel,
      this.chatService.dataChannel
    );
  }

  /**
   * Adds the current logged-in user's ID to the user array of a specific emoji reaction in a message.
   * Updates the document data in Firestore for the channel with the updated reactions.
   * @param {string} emoji - The emoji associated with the reaction to which the user ID is added.
   */
  pushUserToArray(usersFromEmoji: string[]) {
    usersFromEmoji.push(this.mainService.loggedInUser.id);
    this.mainService.setDocData(
      'channels',
      this.chatService.idOfChannel,
      this.chatService.dataChannel
    );
  }

  removeUserFromEmoji(usersFromEmoji: string[]) {
    if (usersFromEmoji.length !== 0) {
      for (let index = 0; index < usersFromEmoji.length; index++) {
        const user = usersFromEmoji[index];
        if (user === this.mainService.loggedInUser.id) {
          this.emojiIndex = index;
          usersFromEmoji.splice(index, 1);
        }
      }
    } else {
      this.removeEmijie();
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
    this.mainService.setDocData(
      'channels',
      this.chatService.idOfChannel,
      this.chatService.dataChannel
    );
  }
}
