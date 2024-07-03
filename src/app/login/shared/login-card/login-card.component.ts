import { Component } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { User } from '../../../../assets/models/user.class';

@Component({
  selector: 'app-login-card',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
  ],
  templateUrl: './login-card.component.html',
  styleUrl: './login-card.component.scss'
})
export class LoginCardComponent {

  constructor(private firestore: Firestore, private router: Router) { }
  email: string = '';
  password: string = '';

  async login() {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, this.email, this.password)
      .then(() => {
        console.log('Dieser Login war erfolgreich');
        this.router.navigate(['main']);

      })
      .catch(() => {
        console.log('Dieser Login ist fehlgeschlagen');
      })

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
