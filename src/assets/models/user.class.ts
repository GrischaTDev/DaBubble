import { Message } from './message.class';
export class User {
  idUser: string;
  name: string;
  email: string;
  avatar: string;
  message: Message[];

  constructor(obj?: any) {
    this.idUser = obj ? obj.idUser : '';
    this.name = obj ? obj.name : '';
    this.email = obj ? obj.email : '';
    this.avatar = obj ? obj.avatar : '';
    this.message = obj?.message || [];
  }

  public toJSON() {
    return {
      idUser: this.idUser,
      name: this.name,
      email: this.email,
      avatar: this.avatar,
      message: this.message,
    };
  }
}
