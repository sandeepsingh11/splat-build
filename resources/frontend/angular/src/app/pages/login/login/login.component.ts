import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { LaravelApiService } from 'src/app/services/laravel-api.service';
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

  constructor(private laravelApiService: LaravelApiService) { }

  ngOnInit(): void {
  }

  username: string = '';
  password: string = '';
  remember: boolean = false;

  error: string = '';

  onSubmit() {
    const loginRequest: LoginRequest = {
      username: this.username,
      password: this.password,
      remember: this.remember,
    }
    this.laravelApiService.login(loginRequest).subscribe((data) => {
      if (data['error']) {
        this.error = data['error'];
      }
      else {
        window.location.href='/gear';
      }
    });
  }
}
