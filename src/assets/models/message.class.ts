export class Message {
    nameUser: string;
    date: number;
    message: string;

    constructor(obj?: any) {
      this.nameUser = obj ? obj.nameUser : '';
      this.date = obj ? obj.name: '';
      this.message = obj ? obj.email : '';
    }
  
    public toJSON() {
      return {
        nameUser: this.nameUser,
        date: this.date,
        message: this.message,
      };
    }
  }
  