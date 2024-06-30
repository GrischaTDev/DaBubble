export class User {
    idUser: string;
    name: string;
    email:string;
    avatar:string;
  
    constructor(obj?: any) {
      this.idUser = obj ? obj.idUser : '';
      this.name = obj ? obj.name: '';
      this.email = obj ? obj.email : '';
      this.avatar = obj ? obj.avatar : '';
    }
  
    public toJSON() {
      return {
        idUser: this.idUser,
        name: this.name,
        email: this.email,
        avatar: this.avatar,
      };
    }
  }

