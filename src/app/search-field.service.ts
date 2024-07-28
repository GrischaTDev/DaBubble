import { Injectable } from '@angular/core';
import { collection, DocumentData, Firestore, onSnapshot, QuerySnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SearchFieldService {

  filterUser: DocumentData[] = [];
  filterChannel: DocumentData[] = [];

  constructor(private firestore: Firestore) { }

    /**
   * 
   * After entering a query in the search field, the data is filtered.
   */
    filterData(searchValue: string) {
      this.setUser(searchValue);
      this.setChannel(searchValue);
    }
  
    /**
     * 
     * This function loads user data from Firestore and then filters it based on the search field input.
     * @returns - Data is being loaded from Firestore.
     */
    setUser(searchValue: string) {
      const docRef = collection(this.firestore, 'users');
      return onSnapshot(docRef, (userList: QuerySnapshot<DocumentData>) => {
        this.filterUser = [];
        userList.forEach(user => {
          const userData = user.data();
          if (userData && userData['name'] && searchValue) {
            const name = userData['name'].toLowerCase();
            const searchValueLower = searchValue.toLowerCase();
            if (name.includes(searchValueLower)) {
              this.filterUser.push(userData);
            }
          }
        });
      })
    }
  
    /**
     * 
     * This function loads user data from Firestore and then filters it based on the search field input.
     * @returns - Data is being loaded from Firestore.
     */
    setChannel(searchValue: string) {
      const docRef = collection(this.firestore, 'channels');
      return onSnapshot(docRef, (channelList: QuerySnapshot<DocumentData>) => {
        this.filterChannel = [];
        channelList.forEach(channel => {
          const channelData = channel.data();
          if (channelData && channelData['name'] && searchValue) {
            const name = channelData['name'].toLowerCase();
            const searchValueLower = searchValue.toLowerCase();
            if (name.includes(searchValueLower)) {
              this.filterChannel.push(channelData);
            } 
          }
        });
      })
    }

}
