export class Emoji {
  emoji: string;
  user: string[] = [];


  constructor(obj?: any) {
    this.emoji = obj ? obj.emoji : '';
    this.user = obj ? obj.user : [];
  }

  public toJSON() {
    return {
      emoji: this.emoji,
      user: this.user,
    };
  }
}
