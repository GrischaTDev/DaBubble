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
  emojiAndUserIsAvailable = false;
  newEmoji: Emoji = new Emoji();

  /**
   * Adds a reaction to a message in the current channel, updating the emoji reactions based on the user interactions.
   * It processes all current reactions for the message, searching and updating as needed, and then marks the added emoji.
   * @param {string} emoji - The emoji character to add as a reaction.
   */
  addReactionToMessage(emoji: string) {
    let data =
      this.chatService.dataChannel.messageChannel[
        this.chatService.indexOfChannelMessage
      ].emojiReaction;
    for (let index = 0; index < data.length; index++) {
      const emojiFb = data[index].emoji;
      const userFb = data[index].user;
      this.searchUserAndEmoji(emoji, emojiFb, userFb);
    }
    this.selectionTheAddedEmoji(emoji);
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
        this.emojiAndUserIsAvailable;
      } else if (emoji === emojiFb) {
        this.emojiIsAvailable = true;
      }
    }
  }

  /**
   * Checks if the emoji is already available in the array of reactions; if not, it adds the emoji to the array.
   * @param {string} emoji - The emoji to be added or checked within the array.
   */
  selectionTheAddedEmoji(emoji: string) {
    if (!this.emojiIsAvailable) {
      this.pushEmojiToArray(emoji);
    }
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
    this.emojiIsAvailable = false;
    this.emojiAndUserIsAvailable = false;
  }
}
