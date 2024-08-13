import { Injectable, OnInit } from '@angular/core';
import { collection, DocumentData, Firestore, onSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import { ChatService } from './service/chat.service';
import { MainServiceService } from './service/main-service.service';
import { User } from '../assets/models/user.class';

@Injectable({
  providedIn: 'root'
})
export class SearchFieldService implements OnInit {

  allUser: DocumentData[] = [];
  allChannel: DocumentData[] = [];
  filterUser: DocumentData[] = [];
  filterChannel: DocumentData[] = [];
  filterMessage: DocumentData[] = [];

  isSearchActive = false;
  at: any;

  constructor(private firestore: Firestore, private chatService: ChatService, private mainService: MainServiceService) { }

  ngOnInit(): void {
    this.setAllChannel();
    this.setAllUser();
  }

    /**
   * 
   * After entering a query in the search field, the data is filtered.
   */
    filterData(searchValue: string) {
      this.setUser(searchValue);
      this.setChannel(searchValue);
    }

    filterDataChannelchat(searchValue: string) {
    this.at = searchValue.lastIndexOf('@');
    const searchValueFilter = searchValue.slice(this.at + 1).toLowerCase();
    if (this.at !== -1) {
        if (searchValueFilter.length === 0) {
            this.filterUser = this.allUser; 
        } else {
            this.filterUser = this.allUser.filter(user => 
                user['name'].toLowerCase().includes(searchValueFilter),
            );
            this.setUser(searchValueFilter)
        }
    } else {
        this.filterUser = [];
        this.setUser(searchValueFilter);
    }
}

    filterNewMessage(searchValue: string) {
      if(searchValue.startsWith('@')) {
        this.setAllUser();
      } else if(searchValue.startsWith('#')) {
        this.setAllChannel();
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
            const name = userData['name'].toLowerCase();
            const searchValueLower = searchValue.toLowerCase();
            if (name.includes(searchValueLower)) {
              this.filterUser.push(userData);
            }
          }
        });
      })
    }

    setAllUser() {
      const docRef = collection(this.firestore, 'users');
      return onSnapshot(docRef, (channelList) => {
        this.allUser= [];
        channelList.forEach(channel => {
          const userData = channel.data();
          this.allUser.push(userData);
        });
      })
    }

    setAllChannel() {
      const docRef = collection(this.firestore, 'channels');
      return onSnapshot(docRef, (channelList) => {
        this.allChannel = [];
          channelList.forEach(channel => {
          const channelData = channel.data();

          if (channelData['channelUsers'].some((channeluser: User) => channeluser['id'] === this.mainService.loggedInUser.id)) {
            this.allChannel.push(channelData);
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

              if(channelData['channelUsers'].some((channeluser: User) => channeluser['id'] === this.mainService.loggedInUser.id)) {
                this.filterChannel.push(channelData);
                console.log('Filter Channel', this.filterChannel)
              }

            } 
          }

          if(channelData && channelData['messageChannel'] && searchValue) {
            channelData["messageChannel"].forEach((message: { [x: string]: string; }) => {
              const messageLower = message['message'].toLowerCase();
              const searchValueLower = searchValue.toLowerCase();
              if(messageLower.includes(searchValueLower)) {
                if(channelData['channelUsers'].some((channeluser: User) => channeluser['id'] === this.mainService.loggedInUser.id)) {
                  this.filterMessage.push( { channelData: channelData, channelName: channelData['name'] , message: message['message']} );
                }
              }
            });
          }
        });
      })
    }

    chooseUser(name: string) {
      const atIndex = this.chatService.text.lastIndexOf('@');
      if (atIndex !== -1) {
        this.chatService.text = this.chatService.text.slice(0, atIndex + 1) + name + ' ';
        this.filterUser = [];
      }
    }



}
