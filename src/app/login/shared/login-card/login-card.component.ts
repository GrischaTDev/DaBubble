import { Component } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { getAuth, signInAnonymously, signInWithEmailAndPassword } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { User } from '../../../../assets/models/user.class';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-card',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './login-card.component.html',
  styleUrl: './login-card.component.scss'
})
export class LoginCardComponent {

  constructor(private firestore: Firestore, private router: Router) { }
  email: string = '';
  password: string = '';
  wrongPassword: string | undefined;
  wrongEmail: string | undefined;

  async login() {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, this.email, this.password)
      .then(() => {
        this.router.navigate(['main']);

      })
      .catch((error: any) => {
        console.log('Fehler beim login', error);
        if(error.code === 'auth/invalid-credential') {
          this.wrongEmail = 'Diese E-Mail-Adresse ist leider ungültig';
          this.wrongPassword = 'Falsches Passwort. Bitte noch einmal prüfen';
        } else if (error.code === 'auth/missing-password') {
          this.wrongPassword = 'Bitte gib ein Passwort ein.';
        } else if (error.code === 'auth/invalid-email') {
          this.wrongEmail = 'Bitte gib eine gültige E-Mail-Adresse an';
        }
      })

  }

  async loginAnonymus() {
    const auth = getAuth();
    await signInAnonymously(auth)
      .then(() => {
        this.router.navigate(['main']);
    })
    .catch((error) => {
      const errorCode = error.code;
      console.log(errorCode);
      const errorMessage = error.message;
      console.log(errorMessage);
      // ...
    });   
  }

  async loginWithGoogle() {

    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {

          const token = credential.accessToken;
          console.log(token);

          const user = result.user;
          console.log(user);
          if(user) {
            const newUser = new User({
              id: user.uid,
              name: user.displayName,
              email: user.email,
              avatar: user.photoURL,
              message: ''
            });

            const userRef = doc(this.firestore, 'users', user.uid);
            await setDoc(userRef, newUser.toJSON());
            
          }

    

          this.router.navigate(['main']);

        }
      })
  }

}
