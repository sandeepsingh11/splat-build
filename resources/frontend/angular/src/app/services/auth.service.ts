import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

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
    this.isLoggedIn();
  }

  loggedIn = new BehaviorSubject(false);

  loginUrl: string = 'api/login';
  logoutUrl: string = 'api/logout';
  getUserUrl: string = 'api/get-user';

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this._http.post<any>(this.loginUrl, credentials)
      .pipe(tap(data => {
        if (data.success) this._userService.setUser(data['userData'])
      }));
  }

  logout(): Observable<any> {
    return this._http.post<any>(this.logoutUrl, {})
      .pipe(tap(() => this._userService.logout()));
  }

  getUser() {
    return this._http.get<any>(this.getUserUrl);
  }

  isLoggedIn(): void {
    if (this._userService.user === null) {
      this.getUser()
        .subscribe((data) => {
          this._userService.setUser(data);

          this.updateLoginStatus((data !== null));
        });
    }
    else {
      this.updateLoginStatus((this._userService.user.username !== ''));
    }
  }

  updateLoginStatus(data: any) {
    this.loggedIn.next(data);
  }

  getCurrentUser(): User | null {
    return this._userService.getCurrentUser();
  }
}
