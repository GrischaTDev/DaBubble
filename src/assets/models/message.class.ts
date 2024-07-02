import { User } from "./user.class";
export class Message {
    nameUser: string;
    date: number;
    message: string;
    answerMessage: Message[];
    mentionUser: User [];

    constructor(obj?: any) {
      this.nameUser = obj ? obj.nameUser : '';
      this.date = obj ? obj.name: '';
      this.message = obj ? obj.email : '';
      this.answerMessage = obj ? obj.answerMessage : [];
      this.mentionUser = obj?.mentionUser || []; 
    }
  
    public toJSON() {
      return {
        nameUser: this.nameUser,
        date: this.date,
        message: this.message,
        answerMessage: this.answerMessage,
        mentionUser: this.mentionUser
      };
    }
  }
  