import { Injectable, inject, OnInit } from '@angular/core'; // OnInit importieren
import { MainServiceService } from '../service/main-service.service';
import { EmailAuthProvider, getAuth, onAuthStateChanged, reauthenticateWithCredential, updateEmail, verifyBeforeUpdateEmail } from '@angular/fire/auth';
import {
  Firestore,
  addDoc,
  setDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService { 

  currentUser: any;

  isEmailSend: boolean = false;
  isEmailError: boolean = false;

  constructor(public mainService: MainServiceService, private firestore: Firestore, private loginService: LoginService) {}


  async updateUserProfile(name: string, email: string) {

    this.loginService.currentLoggedUser();
    this.loginService.loggedInUser$.subscribe((user) => {
      this.currentUser = user;
      console.log('Nutzer Daten von ProfileService', this.currentUser);
    });

    if(!name) { name = this.currentUser.name; } 
    if (!email) { email = this.currentUser.email; }

    await setDoc(doc(this.firestore, 'users', this.currentUser.id), {
      name: name,
    }, { merge: true });

    if(email !== this.currentUser.email) {
      this.updateEmailToAuth(email);
    }
  }

  async updateEmailToAuth(newEmail: string) {

    const auth = getAuth();
    const user = auth.currentUser;

    if(user) {

      await verifyBeforeUpdateEmail(user, newEmail).then(() => {
        this.isEmailSend = true;
      }).catch((error) => {
        this.isEmailError = true;
      });

    }
  }

}
