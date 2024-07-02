import { Message } from "./message.class";
import { User } from "./user.class";

export class Channel {
  idChannel: string;
  name: string;
  description: string;
  channelUsers: User[]; 
  channelMessage: Message[]; 
  avatar: string;
  
  constructor(obj?: any) {
    this.idChannel = obj?.idChannel || '';
    this.name = obj?.name || '';
    this.description = obj?.description || '';
    this.channelUsers = obj?.channelUsers || []; 
    this.channelMessage = obj?.channelMessage || [];
    this.avatar = obj?.avatar || '';
  }

  public toJSON() {
    return {
      idChannel: this.idChannel,
      name: this.name,
      description: this.description,
      channelUsers: this.channelUsers.map(user => ({
        idUser: user.idUser,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      })),
      messageChannel: this.channelMessage.map(user => ({
        nameUser: user.nameUser,
        date: user.date,
        message: user.message,
        answerMessage: user.answerMessage,
        mentionUser: user.mentionUser
      })),
      avatar: this.avatar,
    };
  }
}

  