import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { doc, Firestore, onSnapshot, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../assets/models/user.class';

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

  private newMailSubject = new BehaviorSubject<boolean>(false);
  isNewMail$ = this.newMailSubject.asObservable();

  private loggedInUserSubject = new BehaviorSubject<User | null>(null);
  loggedInUser$: Observable<User | null> = this.loggedInUserSubject.asObservable();

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

  setNewEmailOverlay(isVerifyMail: boolean) {
    this.newMailSubject.next(isVerifyMail);
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

  currentLoggedUser() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      const userId = user?.uid;
      if (user) {
        onSnapshot(
          doc(this.firestore, 'users', userId ?? 'default'),
          (item) => {
            if (item.exists()) {
              let userData = {
                ...item.data(),
                id: item.id,
              };
              this.loggedInUserSubject.next(new User(userData));
            }
          });
      }
    });
  }


}