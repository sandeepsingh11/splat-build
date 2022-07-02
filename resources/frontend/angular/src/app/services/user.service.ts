import { Injectable } from '@angular/core';
import { User } from '../types';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  user: User | null = null;

  setUser(userData: any): void {
    this.user = {username: '', email: '', createdAt: ''};

    if (userData !== null) {
      this.user!.username = userData['username'];
      this.user!.email = userData['email'];
      this.user!.createdAt = userData['createdAt'];
    }
    else {
      this.user!.username = '';
      this.user!.email = '';
      this.user!.createdAt = '';
    }
  }

  getCurrentUser(): User | null {    
    return this.user!;
  }

  logout(): void {
    this.user!.createdAt = '';
    this.user!.email = '';
    this.user!.username = '';
    this.user = null;
  }
}
