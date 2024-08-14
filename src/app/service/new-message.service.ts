import { Injectable } from '@angular/core';
import { ChatService } from './chat.service';
import { DirectMessageService } from './direct-message.service';
import { MainServiceService } from './main-service.service';
import { User } from '../../assets/models/user.class';
import { Channel } from '../../assets/models/channel.class';
import { Message } from '../../assets/models/message.class';

@Injectable({
  providedIn: 'root'
})
export class NewMessageService {

  searchText: string = '';
  text: string = '';
  userData: User | undefined;
  channelData: Channel | undefined;

  constructor(
    private chatService: ChatService,
    private directMessageService: DirectMessageService,
    private mainService: MainServiceService

  ) { }

  async chooseUser(name: string, user: User) {
    this.searchText = name;
    this.userData = user;
    try {
      await this.directMessageIsAvailable(this.userData);
    }
    catch(err) {
      console.log('Ist hier ein Fehler:', err);
    }
    console.log(this.userData)
  }

  chooseChannel(name: string, channel: any) {
    this.searchText = name;
    this.channelData = new Channel(channel);
  }

  async sendMessage(message: string) {
    if(this.userData) {
      console.log(this.chatService.dataChannel.id);
      this.directMessageService.sendMessageFromDirectMessage(this.directMessageService.dataDirectMessage.id, message);
      this.searchText = '';
      this.text = '';
    } else if (this.channelData) {
      console.log('Das sind die Daten aus dem Channel den man gewählt hat:', this.channelData)
      this.chatService.messageChannel = new Message(this.channelData);
      console.log('Übergeben der Daten an den chatService:', this.chatService.messageChannel)
      await this.chatService.sendMessageFromChannel(this.channelData.id, message);
    }
  }

  async directMessageIsAvailable(userData: User) {
    this.directMessageService.directMessageIdIsAvailable = false;
    this.directMessageService.directMessageId = '';
    let choosedUserMessages = userData.message;
    let loggedInUserMessages = this.mainService.loggedInUser.message;
    if (Array.isArray(choosedUserMessages) && Array.isArray(loggedInUserMessages)) {
      let commonMessages = choosedUserMessages.filter(msg => loggedInUserMessages.includes(msg));
      if (commonMessages.length !== 0) {
        this.directMessageService.directMessageDocId = commonMessages[0].toString();
        this.directMessageService.directMessageIdIsAvailable = true;
        await this.loadDirectChatContent(this.directMessageService.directMessageDocId);
      }
    }
    await this.pushDirectMessageDocToFirebase(userData);
  }

  async pushDirectMessageDocToFirebase(userData: User) {
    if (!this.directMessageService.directMessageIdIsAvailable) {
      this.directMessageService.newDataDirectMessage.channelUsers = [];
      await this.mainService.addNewDocOnFirebase('direct-message', new Channel(this.directMessageService.newDataDirectMessage));
      await this.pushDirectMessageIdToUser(userData);
      await this.loadDirectChatContent(this.directMessageService.directMessageDocId);
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

  async loadDirectChatContent(chatId: string) {
    this.directMessageService.directMessageDocId = chatId;
      this.mainService.watchSingleDirectMessageDoc(chatId, 'direct-message').subscribe(dataDirectMessage => {
        this.chatService.dataChannel = dataDirectMessage as Channel;
      });
    }


}
