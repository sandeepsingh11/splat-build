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
  ) {
    if (this.isLoggedIn()) {
      this._token = localStorage.getItem('sb_tok');
      this._userEncodedString = localStorage.getItem('sb_user');

      // if user is not set in user service, set it
      if (
        _userService.user === null && 
        this._userEncodedString !== null
      ) {
        const user = JSON.parse(atob(this._userEncodedString));
        _userService.setUser(user);
      }
    }
  }

  loginUrl: string = 'api/login';
  logoutUrl: string = 'api/logout';
  getUserUrl: string = 'api/get-user';

  private _token: string | null = null;
  private _userEncodedString: string | null = null;

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this._http.post<any>(this.loginUrl, credentials)
      .pipe(tap(data => {
        if (data.success) {
          this._userService.setUser(data.userData);

          const userJson = {
            username: this._userService.user?.username,
            email: this._userService.user?.email,
            createdAt: this._userService.user?.createdAt,
          }
          const userJsonString: string = JSON.stringify(userJson);
          
          localStorage.setItem('sb_tok', data.token!);
          localStorage.setItem('sb_user', btoa(userJsonString));
        }
      }));
  }

  logout(): Observable<any> {
    return this._http.post<any>(this.logoutUrl, {})
      .pipe(tap(() => {
        this._userService.logout();

        localStorage.clear();
      }));
  }

  isLoggedIn(): boolean {
    const loggedIn = (
      (localStorage.getItem('sb_tok') !== null) &&
      (localStorage.getItem('sb_user') !== null)
    );
    
    return loggedIn;
  }

  getCurrentUser(): User | null {
    return this._userService.getCurrentUser();
  }

  getUser() {
    return this._http.get<any>(this.getUserUrl);
  }

  setUser(userData: any) {
    this._userService.setUser(userData);
  }
}
