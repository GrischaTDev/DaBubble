import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import { DirectMessageService } from './direct-message.service';
import { MainServiceService } from './main-service.service';
import { User } from '../../assets/models/user.class';
import { Channel } from '../../assets/models/channel.class';
import { Message } from '../../assets/models/message.class';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NewMessageService {

  searchText: string = '';
  text: string = '';
  userData: User | undefined;
  channelData: Channel = new Channel();
  sendetMessage: boolean = false;
  messageChannel: Message = new Message();
  dataChannel: Channel = new Channel();
  newThreadOnFb: Channel = new Channel();

  constructor(
    private chatService: ChatService,
    private directMessageService: DirectMessageService,
    private mainService: MainServiceService,
    private router: Router
  ) { }

  async chooseUser(name: string, user: User) {
    this.searchText = name;
    this.userData = user;
    this.directMessageService.userIdNewMessage = user.id;

    try {
      await this.directMessageIsAvailableNewMessage(this.userData);
    }
    catch (err) {
      console.log('Ist hier ein Fehler:', err);
    }
    console.log(this.userData)
  }

  chooseChannel(name: string, channel: any) {
    this.searchText = name;
    this.channelData = new Channel(channel);
  }


  async sendMessage(message: string) {
      await this.loadDirectChatContent(this.directMessageService.directMessageDocId);
      if (this.userData) {
        this.directMessageService.sendMessageFromDirectMessage(this.directMessageService.dataDirectMessage.id, message);
        this.searchText = '';
        this.text = '';
      } else if (this.channelData) {
        console.log('Channel Data Id:', this.channelData.id);
        this.sendMessageFromChannel(this.channelData.id, message);
      }
  }

  async loadDirectChatContent(chatId: string) {
    this.directMessageService.directMessageDocId = chatId;
    this.mainService.watchUsersDoc( this.directMessageService.userIdNewMessage, 'users').subscribe((dataUser) => {
      this.chatService.clickedUser = dataUser as User;
    });
    return new Promise((resolve) => {
      this.mainService.watchSingleDirectMessageDoc(chatId, 'direct-message').subscribe(dataDirectMessage => {
        this.chatService.dataChannel = dataDirectMessage as Channel;
        resolve(dataDirectMessage); 
      });
    });
  }

  async directMessageIsAvailableNewMessage(userData: User) {
    this.directMessageService.directMessageIdIsAvailable = false;
    this.directMessageService.directMessageId = '';
    let choosedUserMessages = userData.message;
    let loggedInUserMessages = this.mainService.loggedInUser.message;
    if (Array.isArray(choosedUserMessages) && Array.isArray(loggedInUserMessages)) {
      let commonMessages = choosedUserMessages.filter(msg => loggedInUserMessages.includes(msg));
      if (commonMessages.length !== 0) {
        this.directMessageService.directMessageDocId = commonMessages[0].toString();
        this.directMessageService.directMessageIdIsAvailable = true;
      }
    }
    await this.pushDirectMessageDocToFirebase(userData);
  }

  async pushDirectMessageDocToFirebase(userData: User) {
    if (!this.directMessageService.directMessageIdIsAvailable) {
      this.directMessageService.newDataDirectMessage.channelUsers = [];
      await this.mainService.addNewDocOnFirebase('direct-message', new Channel(this.directMessageService.newDataDirectMessage));
      await this.pushDirectMessageIdToUser(userData);
    }
  }


  async pushDirectMessageIdToUser(userData: User) {
    this.mainService.loggedInUser.message.push(this.mainService.docId);
    userData.message.push(this.mainService.docId);
    this.directMessageService.directMessageId = this.mainService.docId;
    this.directMessageService.newDataDirectMessage.id = this.mainService.docId;
    this.directMessageService.newDataDirectMessage.channelUsers.push(new User(this.mainService.loggedInUser));
    this.directMessageService.newDataDirectMessage.channelUsers.push(new User(userData));
    this.pushNewDirectmessageContenToFb(userData);
  }

  async pushNewDirectmessageContenToFb(userData: User) {
    await this.mainService.addDoc(
      'users', this.mainService.loggedInUser.id, new User(this.mainService.loggedInUser));
    await this.mainService.addDoc('users', userData.id, new User(userData)
    );
    await this.mainService.addDoc('direct-message', this.directMessageService.directMessageDocId, new Channel(this.directMessageService.newDataDirectMessage)
    );

  }




  // Send Channel Message 

  async sendMessageFromChannel(channelId: string, textContent: string) {
    if (textContent) {
      try {
        console.log('Console.log vor der generate Doc')
        await this.generateThreadDoc();
      }
      catch (err) {
        console.log('Error', err);
      }
      this.messageChannel.message = textContent;
      this.messageChannel.date = Date.now();
      this.messageChannel.userId = this.mainService.loggedInUser.id;
      this.messageChannel.userName = this.mainService.loggedInUser.name;
      this.messageChannel.userEmail = this.mainService.loggedInUser.email;
      this.messageChannel.userAvatar = this.mainService.loggedInUser.avatar;
      this.messageChannel.dateOfLastThreadMessage = Date.now();
      this.messageChannel.numberOfMessage = 0;
      this.channelData.messageChannel.push(this.messageChannel);
      this.sendMessageChannel();
    }
  }

  async generateThreadDoc() {
    this.sendetMessage = true;
    this.newThreadOnFb.messageChannel.splice(0, 1)
    this.newThreadOnFb.id = '';
    await this.mainService.addNewDocOnFirebase('threads', this.newThreadOnFb);
    this.messageChannel.thread = this.mainService.docId;
    this.newThreadOnFb.id = this.mainService.docId;
    this.resetMessageContent();
  }

  resetMessageContent() {
    this.text = '';
    this.searchText = '';
    setTimeout(() => {
      this.sendetMessage = false;
    }, 2000);
  }

  async sendMessageChannel() {
    this.newThreadOnFb.messageChannel.push(this.messageChannel);
    this.newThreadOnFb.idOfChannelOnThred = this.channelData.id;
    this.newThreadOnFb.name = this.channelData.name;
    try {
      await this.mainService.addDoc('threads', this.newThreadOnFb.id, new Channel(this.newThreadOnFb));
      await this.mainService.addDoc('channels', this.channelData.id, new Channel(this.channelData));
    }
    catch (err) {
      console.log('error', err);
    }
  }

}
