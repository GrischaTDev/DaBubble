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
    }, { merge: true });

    if(email) {
      this.updateEmailToAuth(email);
    }
  }

  async updateEmailToAuth(newEmail: string) {

    const auth = getAuth();
    const user = auth.currentUser;

    if(user) {

      await verifyBeforeUpdateEmail(user, newEmail).then(() => {
        console.log("Verifizierungs-E-Mail wurde gesendet. Bitte überprüfe deine neue E-Mail-Adresse und bestätige sie.");
      }).catch((error) => {
        console.error("Fehler beim Senden der Verifizierungs-E-Mail:", error);
      });

    }
  }

}
