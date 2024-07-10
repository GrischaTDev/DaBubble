import { Injectable } from '@angular/core';
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

  constructor() { }

  setUserRegistered(isRegistered: boolean) {
    this.userRegisteredSubject.next(isRegistered);
  }

  setResetPasswordOverlay(isSendMail: boolean) {
    this.sendResetPasswordMailSubject.next(isSendMail);
  }

  setNewPasswordOverlay(isLogin: boolean) {
    this.newPasswordSubject.next(isLogin);
  }
}