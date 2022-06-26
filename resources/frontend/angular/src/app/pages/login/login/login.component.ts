// import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { LoginRequest } from 'src/app/types';

// imports:[
//   HttpClientModule,
//   HttpClientXsrfModule.withOptions({cookieName: 'splat_build_session', headerName: 'X-XSRF-TOKEN'})
// ]

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private _authService: AuthService) { }

  ngOnInit(): void {
  }

  username: string = '';
  password: string = '';
  remember: boolean = false;

  error: string = '';

  onSubmit() {
    if (
      this.username === '' ||
      this.password === ''
    ) {
      this.error = 'All fields are required';
    }
    else {
      const loginRequest: LoginRequest = {
        username: this.username,
        password: this.password,
        remember: this.remember,
      }
      this._authService.login(loginRequest).subscribe((data) => {
        if (data['error']) {
          this.error = data['error'];
        }
        else if (data['success']) {
          window.location.href='/';
        }
      });
    }
  }
}
