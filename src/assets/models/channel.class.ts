import { Message } from "./message.class";
import { User } from "./user.class";

export class Channel {
  id: string;
  name: string;
  description: string;
  channelUsers: User[] = []; 
  channelMessage: Message[] = []; 
  avatar: string;
  
  constructor(obj?: any) {
    this.id = obj?.id || '';
    this.name = obj?.name || '';
    this.description = obj?.description || '';
    this.channelUsers = obj?.channelUsers || []; 
    this.channelMessage = obj?.channelMessage || [];
    this.avatar = obj?.avatar || '';
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      channelUsers: this.channelUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      })),
      messageChannel: this.channelMessage.map(user => ({
        user: user.user,
        date: user.date,
        message: user.message,
        answerMessage: user.answerMessage,
        mentionUser: user.mentionUser
      })),
      avatar: this.avatar,
    };
  }
}

  