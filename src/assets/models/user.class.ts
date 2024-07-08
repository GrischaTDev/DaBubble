import { Message } from './message.class';
export class User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  message: Message[] = [];

  constructor(obj?: any) {
    this.id = obj ? obj.id : '';
    this.name = obj ? obj.name : '';
    this.email = obj ? obj.email : '';
    this.avatar = obj ? obj.avatar : '';
    this.message = obj?.message || [];
  }

  public toJSON() {
    return {
      idUser: this.id,
      name: this.name,
      email: this.email,
      avatar: this.avatar,
      message: this.message,
    };
  }
}
