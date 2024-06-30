import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  onSnapshot,
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../assets/models/user.class';

@Injectable({
  providedIn: 'root',
})
export class MainServiceService {
  unsubUserList;
  changeContent(inputContent: string) {
    throw new Error('Method not implemented.');
  }
  constructor() {
    this.unsubUserList = this.subUserList();
  }
  private contentSource = new BehaviorSubject<string>('');
  currentContentEmoji = this.contentSource.asObservable();
  user: User = new User();
  firestore: Firestore = inject(Firestore);
  allUsers: User[] = [];

  changeContentEmoji(content: string) {
    this.contentSource.next(content);
  }

  /**
   * Adds the current user to Firebase Firestore.
   * Attempts to add the user and logs the result. Handles any errors during the process.
   * Resets the loading state and updates the UI.
   *
   * @async
   * @function addNewUserOnFirebase
   * @returns {Promise<void>} A promise that resolves when the user is added.
   */
  async addNewUserOnFirebase() {
    try {
      await addDoc(collection(this.firestore, 'users'), this.user.toJSON());
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      /* this.dialogRef.close(); */
    }
  }

  /**
   * Initializes component by setting up a snapshot listener on the 'users' collection from Firestore.
   * Updates `allUsers` array with `User` instances representing each document in the collection.
   * Each `User` instance is created from the document's data, including a unique ID.
   */
  subUserList() {
    return onSnapshot(collection(this.firestore, 'users'), (list) => {
      this.allUsers = [];
      list.forEach((element) => {
        console.log(element.data());
        let userData = {
          ...element.data(),
          idUser: element.id,
        };
        this.allUsers.push(new User(userData));
        console.log(this.allUsers);
      });
    });
  }

  /**
   * Unsubscribes from user list to prevent memory leaks.
   * This method is called automatically by Angular just before the component is destroyed.
   */
  ngOnDestroy() {
    this.unsubUserList();
  }
}
