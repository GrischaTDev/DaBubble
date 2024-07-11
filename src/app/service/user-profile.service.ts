import { Injectable, inject, OnInit } from '@angular/core'; // OnInit importieren
import { MainServiceService } from '../service/main-service.service';
import { getAuth, onAuthStateChanged, updateEmail } from '@angular/fire/auth';
import {
  Firestore,
  addDoc,
  setDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService { // OnInit implementieren
  currentUser = this.mainService.loggedInUser;

  constructor(public mainService: MainServiceService, private firestore: Firestore) {}


  async updateUserProfile(name: string, email: string) {
    if(!name) { name = this.currentUser.name; } 
    if (!email) { email = this.currentUser.email; }

    await setDoc(doc(this.firestore, 'users', this.currentUser.id), {
      name: name,
      email: email
    }, { merge: true });

    this.updateEmailToAuth(email);

  }

  updateEmailToAuth(newEmail: string) {

    const auth = getAuth();
    const user = auth.currentUser;

    if(user) {
      updateEmail(user, newEmail).then(() => {
        console.log('Email wurde erfolgreich geändert!')
       }).catch((error: any) => {
        console.log(error);
       })
    }
  }
}
