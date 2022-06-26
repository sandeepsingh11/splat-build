import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { LoginRequest, LoginResponse, User } from '../types';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _http: HttpClient,
    private _userService: UserService
  ) { }

  loginUrl: string = 'api/login';

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this._http.post<any>(this.loginUrl, credentials)
      .pipe(tap(data => this._userService.setUser(data['userData'])));
  }

  logout() {
    // logout endpoint
  }

  isLoggedIn(): boolean {
    return (this._userService.username) ? true : false;
  }

  getCurrentUser(): User {
    return this._userService.getCurrentUser();
  }
}
