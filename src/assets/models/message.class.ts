export class Message {
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  date: number;
  message: string;
  emojis: string[] = [];
 
  constructor(obj?: any) {
    this.userId = obj?.userId || '';
    this.userName = obj?.userName || '';
    this.userEmail = obj?.userEmail || '';
    this.userAvatar = obj?.userAvatar || '';
    this.date = obj ? obj.data : '';
    this.message = obj ? obj.email : '';
    this.emojis = obj?.emojis || [];
  }

  public toJSON() {
    return {
      userId: this.userId,
      userName: this.userName,
      userEmail: this.userEmail,
      userAvatar: this.userAvatar,
      nameUser: this.userName,
      date: this.date,
      message: this.message,
      emojis: this.emojis,
    };
  }
}
