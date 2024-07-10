import { Injectable } from '@angular/core';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  private userRegisteredSubject = new BehaviorSubject<boolean>(false);
  isUserRegistered$ = this.userRegisteredSubject.asObservable();

  private sendResetPasswordMailSubject = new BehaviorSubject<boolean>(false);
  sendResetPasswordMail$ = this.sendResetPasswordMailSubject.asObservable();

  private newPasswordSubject = new BehaviorSubject<boolean>(false);
  isNewPassword$ = this.newPasswordSubject.asObservable();

  constructor(private firestore: Firestore) { }

  setUserRegistered(isRegistered: boolean) {
    this.userRegisteredSubject.next(isRegistered);
  }

  setResetPasswordOverlay(isSendMail: boolean) {
    this.sendResetPasswordMailSubject.next(isSendMail);
  }

  setNewPasswordOverlay(isLogin: boolean) {
    this.newPasswordSubject.next(isLogin);
  }


  // Loggout 

  logoutUser(auth: any) {
    const user = auth.currentUser;

    if (user) {
      console.log(user.uid);
      setDoc(doc(this.firestore, 'users', user.uid), {
        online: false
      }, { merge: true });
    }
  }
}