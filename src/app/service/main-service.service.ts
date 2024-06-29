import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainServiceService {
  changeContent(inputContent: string) {
    throw new Error('Method not implemented.');
  }
  constructor() {}
  private contentSource = new BehaviorSubject<string>('');

  currentContentEmoji = this.contentSource.asObservable();

  changeContentEmoji(content: string) {
    this.contentSource.next(content);
  }
}
