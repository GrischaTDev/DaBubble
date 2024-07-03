import { User } from "./user.class";
export class Message {
    user: string;
    date: number;
    message: string;
    answerMessage: Message[];
    mentionUser: User [];

    constructor(obj?: any) {
      this.user = obj ? obj.user : '';
      this.date = obj ? obj.data: '';
      this.message = obj ? obj.email : '';
      this.answerMessage = obj ? obj.answerMessage : [];
      this.mentionUser = obj?.mentionUser || []; 
    }
  
    public toJSON() {
      return {
        nameUser: this.user,
        date: this.date,
        message: this.message,
        answerMessage: this.answerMessage,
        mentionUser: this.mentionUser
      };
    }
  }
  