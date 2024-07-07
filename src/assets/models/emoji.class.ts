import { User } from './user.class';

export class Emoji {
  emoji: string;
  users: User[] = [];
  id: string = '';

  constructor(obj?: any) {
    this.emoji = obj ? obj.emoji : '';
    this.users = obj ? obj.users : [];
    this.id = obj ? obj.id : '';
  }

  public toJSON() {
    return {
      emoji: this.emoji,
      users: this.users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      })),
      id: this.id
    };
  }
}
