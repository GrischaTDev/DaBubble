import { Message } from './message.class';
import { User } from './user.class';

export class Channel {
  id: string;
  name: string;
  description: string;
  channelUsers: User[] = [];
  messageChannel: Message[] = [];
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  avatarChannel: string;
  mentionUser: string;
  thread: string;
  messageToMe: boolean;
  ownerUser: User[] = [];

  constructor(obj?: any) {
    this.id = obj?.id || '';
    this.name = obj?.name || '';
    this.description = obj?.description || '';
    this.channelUsers = obj?.channelUsers || [];
    this.messageChannel = obj?.messageChannel || [];
    this.userId = obj?.userId || '';
    this.userName = obj?.userName || '';
    this.userEmail = obj?.userEmail || '';
    this.userAvatar = obj?.userAvatar || '';
    this.avatarChannel = obj?.avatar || '';
    this.mentionUser= obj?.mentionUser || [];
    this.thread= obj?.thread || '';
    this.messageToMe = obj?.messageToMe;
    this.ownerUser = obj?.ownerUser || [];
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      channelUsers: this.channelUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      })),
      messageChannel: this.messageChannel.map((message) => ({
        userId: message.userId,
        userName: message.userName,
        userEmail: message.userEmail,
        userAvatar: message.userAvatar,
        date: message.date,
        message: message.message,
        emojiReaction: message.emojiReaction,
        mentionUser: message.mentionUser,
        thread: message.thread
      })),
      avatarChannel: this.avatarChannel,
      messageToMe: this.messageToMe,
      ownerUser: this.ownerUser.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      })),
    };
  }
}