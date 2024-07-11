import { Injectable, inject, OnInit } from '@angular/core'; // OnInit importieren
import { MainServiceService } from '../service/main-service.service';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
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
  firestore: Firestore = inject(Firestore);
  currentUser = this.mainService.loggedInUser;
  // const auth = getAuth();

  constructor(public mainService: MainServiceService) {}


  async updateUserProfile(name: string, email: string) {
    if(!name) { name = this.currentUser.name; } 
    if (!email) { email = this.currentUser.email; }

    await setDoc(doc(this.firestore, 'users', this.currentUser.id), {
      name: name,
      email: email
    }, { merge: true });
  }

  // updateEmail(auth.currentUser, "user@example.com").then(() => {
  //   // Email updated!
  //   // ...
  // }).catch ((error) => {
  //   // An error occurred
  //   // ...
  // });
}
