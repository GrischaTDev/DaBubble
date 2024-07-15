export class Message {
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  date: number;
  message: string;
  mentionUser: string[] = [];
  thread: string = '';
  users0fTheEmoji: string[] = [];
  user0fTheEmoji: string[] = [];
  userIdEmoji: string[] = [];
  user: string[] = [];
  emojiReaction: { emoji: string; user: string[] }[] = [];

  constructor(obj?: any) {
    this.userId = obj?.userId || '';
    this.userName = obj?.userName || '';
    this.userEmail = obj?.userEmail || '';
    this.userAvatar = obj?.userAvatar || '';
    this.date = obj ? obj.data : '';
    this.message = obj ? obj.email : '';
    this.user = obj?.user || [];
    this.emojiReaction = obj ? obj.emojiReaction : [];
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
      users0fTheEmoji: this.user0fTheEmoji,
      mentionUser: this.mentionUser,
      thread: this.thread,
      emojiReaction: this.emojiReaction,
    };
  }
}
