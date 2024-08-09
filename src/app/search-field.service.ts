import { Injectable } from '@angular/core';
import { collection, DocumentData, Firestore, onSnapshot, QuerySnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SearchFieldService {

  allUser: DocumentData[] = [];
  filterUser: DocumentData[] = [];
  filterChannel: DocumentData[] = [];
  filterMessage: DocumentData[] = [];

  isSearchActive = false;

  constructor(private firestore: Firestore) { }

    /**
   * 
   * After entering a query in the search field, the data is filtered.
   */
    filterData(searchValue: string) {
      this.setUser(searchValue);
      this.setChannel(searchValue);
    }

    filterDataChannelchat(searchValue: string) {
      if(searchValue.includes('@')) {
        this.isSearchActive = true;
        const searchValueFilter = searchValue.slice(1);
        this.setUser(searchValueFilter);
      }
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
            this.allUser.push(userData)
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
        this.filterMessage = [];

        channelList.forEach(channel => {
          const channelData = channel.data();

          if (channelData && channelData['name'] && searchValue) {
            const name = channelData['name'].toLowerCase();
            const searchValueLower = searchValue.toLowerCase();
            if (name.includes(searchValueLower)) {
              this.filterChannel.push(channelData);
            } 
          }

          if(channelData && channelData['messageChannel'] && searchValue) {
            channelData["messageChannel"].forEach((message: { [x: string]: string; }) => {
              const messageLower = message['message'].toLowerCase();
              const searchValueLower = searchValue.toLowerCase();
              if(messageLower.includes(searchValueLower)) {
                this.filterMessage.push( { channelData: channelData, channelName: channelData['name'] , message: message['message']} );
              }
            });
          }
        });
      })
    }



}
