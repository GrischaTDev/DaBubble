import { Injectable, inject, OnInit } from '@angular/core'; // OnInit importieren
import { MainServiceService } from '../service/main-service.service';
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

  constructor(public mainService: MainServiceService,) {
    console.log('User Profile Service', this.currentUser) 
  }


  // async userData() {
  //   let userData = doc(this.firestore, 'users');
  // }


  // async userUpdate() { 
  //   try {
  //     await setDoc(doc(this.firestore, "users"), this.currentUser.id {
  //       name: this.currentUser.name,
  //       email: this.currentUser.email
  //     });
  //   } catch (error) {
  //     console.error("Fehler beim Aktualisieren des Benutzers:", error);
  //   }
  // }
}
