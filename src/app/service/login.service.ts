import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private userRegisteredSubject = new BehaviorSubject<boolean>(false);
  isUserRegistered$ = this.userRegisteredSubject.asObservable();

  constructor() { }

  setUserRegistered(isRegistered: boolean) {
    this.userRegisteredSubject.next(isRegistered);
  }
}