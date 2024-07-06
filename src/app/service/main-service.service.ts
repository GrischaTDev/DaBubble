import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../assets/models/user.class';
import { Channel } from '../../assets/models/channel.class';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class MainServiceService {
  unsubUserList;
  unsubChannelsList;
  changeContent(inputContent: any) {
    throw new Error('Method not implemented.');
  }
  constructor(private router: Router) {
    this.unsubUserList = this.subUserList();
    this.unsubChannelsList = this.subChannelsList();
  }
  private contentSource = new BehaviorSubject<any>([]);
  currentContentEmoji = this.contentSource.asObservable();
  mentionUser = this.contentSource.asObservable();
  channel: Channel = new Channel();
  firestore: Firestore = inject(Firestore);
  allUsers: User[] = [];
  allChannels: Channel[] = [];
  loggedInUser: any = [];
  testUser: User = new User();

  changeInputContent(content: any) {
    this.contentSource.next(content);
  }

  /**
   * Adds the current user to Firebase Firestore.
   * Attempts to add the user and logs the result. Handles any errors during the process.
   * Resets the loading state and updates the UI.
   *
   * @async
   * @function addNewDocOnFirebase
   * @returns {Promise<void>} A promise that resolves when the user is added.
   */
  async addNewDocOnFirebase(docName: string, data: Channel | User) {
    try {
      await addDoc(collection(this.firestore, docName), data.toJSON());
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      /* this.dialogRef.close(); */
    }
  }

  currentLoggedUser() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      const userId = user?.uid;

      if (user) {
        onSnapshot(doc(this.firestore, 'users', userId ?? 'default'), (item) => {
          if (item.exists()) {
            this.loggedInUser = item.data();
            console.log(this.loggedInUser);
          }
        });
      };
    });
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
        let userData = {
          ...element.data(),
          id: element.id,
        };
        this.allUsers.push(new User(userData));
      });
    });
  }

  /**
   * Initializes component by setting up a snapshot listener on the 'users' collection from Firestore.
   * Updates `allUsers` array with `User` instances representing each document in the collection.
   * Each `User` instance is created from the document's data, including a unique ID.
   */
  subChannelsList() {
    return onSnapshot(collection(this.firestore, 'channels'), (list) => {
      this.allChannels = [];
      list.forEach((element) => {
        let userData = {
          ...element.data(),
          id: element.id,
        };
        this.allChannels.push(new Channel(userData));
      });
    });
  }

  /**
   * Asynchronously adds or updates a document within a collection in Firestore.
   * @param {string} docName - The name of the document to be added or updated.
   * @param {string} collectionId - The ID of the collection where the document will be stored.
   * @param {Channel|User} data - The data to be stored, which should be an instance of Channel or User.
   * @returns {Promise<void>} A promise that resolves when the update is complete and logs any errors encountered.
   */
  async addCollection(
    docName: string,
    collectionId: string,
    data: Channel | User
  ) {
    await updateDoc(
      doc(collection(this.firestore, docName), collectionId),
      data.toJSON()
    )
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        /* this.dialogRef.close(); */
      });
  }

  /**
   * Navigates to the specific collection path based on the provided data's ID.
   * This function is typically used to route to a specific chat based on the channel or user's ID.
   * @param {Channel|User} data - The data object containing the ID to navigate to, which can be a Channel or User instance.
   */
  async goToCollectionPath(data: Channel | User, path: string) {
    this.router.navigateByUrl(path + data.id);
  }

  /**
   * Retrieves a reference to a specific document within the 'games' collection in Firestore.
   * This reference can be used for further operations like reading or updating the document.
   * @param {string} id - The unique identifier of the document within the 'games' collection.
   * @returns {DocumentReference} A reference to the specified Firestore document.
   */
  getDataRef(id: string, docName: string) {
    return doc(collection(this.firestore, docName), id);
  }

  /**
   * Unsubscribes from user list to prevent memory leaks.
   * This method is called automatically by Angular just before the component is destroyed.
   */
  ngOnDestroy() {
    this.unsubUserList();
    this.unsubChannelsList();
  }
}
