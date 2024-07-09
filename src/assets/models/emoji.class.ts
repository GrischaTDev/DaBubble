export class Emoji {
  emoji: string;
  id: string[] = [];

  constructor(obj?: any) {
    this.emoji = obj ? obj.emoji : '';
    this.id = obj ? obj.id : [];
  }

  public toJSON() {
    return {
      emoji: this.emoji,
      id: this.id,
    };
  }
}
