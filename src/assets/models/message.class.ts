export class Message {
    nameUser: string;
    date: number;
    message: string;
    answerMessage: Message[];

    constructor(obj?: any) {
      this.nameUser = obj ? obj.nameUser : '';
      this.date = obj ? obj.name: '';
      this.message = obj ? obj.email : '';
      this.answerMessage = obj ? obj.answerMessage : [];
    }
  
    public toJSON() {
      return {
        nameUser: this.nameUser,
        date: this.date,
        message: this.message,
        answerMessage: this.answerMessage
      };
    }
  }
  