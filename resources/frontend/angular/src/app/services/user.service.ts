import { Injectable } from '@angular/core';
import { User } from '../types';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  username: string = '';
  email: string = '';
  createdAt: string = '';

  setUser(userData: any): void {
    this.username = userData['username'];
    this.email = userData['email'];
  }

  getCurrentUser(): User {
    return {
      'createdAt': this.createdAt,
      'email': this.email,
      'username': this.username,
    }
  }
}
