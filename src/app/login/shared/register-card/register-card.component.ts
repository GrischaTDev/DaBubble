import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth } from '@angular/fire/auth';
import { addDoc, collection, doc, Firestore, getFirestore, setDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../../assets/models/user.class';

@Component({
  selector: 'app-register-card',
  standalone: true,
  imports: [
    MatIconModule,
    RouterModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './register-card.component.html',
  styleUrl: './register-card.component.scss'
})

export class RegisterCardComponent implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';
  users = new User;


  constructor(private router: Router, private firestore: Firestore) { 
    
  }

  ngOnInit(): void {
    
  }


  async saveRegister(): Promise<void> {

    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
      const user = userCredential.user;
      console.log(user);

      const newUser = new User({
        id: user.uid,
        name: this.name,
        email: this.email,
        avatar: '',
        message: ''
      });

      const userRef = doc(this.firestore, 'users', user.uid);
      await setDoc(userRef, newUser.toJSON());
      this.router.navigate(['/create-avatar']);

    } catch (error: any) {


    }
  }

}
