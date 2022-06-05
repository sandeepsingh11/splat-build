import { Component, OnInit } from '@angular/core';
import { LaravelApiService } from 'src/app/services/laravel-api.service';
import { RegisterRequest } from 'src/app/types';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  constructor(private laravelApiService: LaravelApiService) { }

  ngOnInit(): void {
  }

  username: string = '';
  email: string = '';
  password: string = '';
  password_confirmation: string = '';

  error: string = '';

  onSubmit() {
    if (
      this.username === '' ||
      this.email === '' ||
      this.password === '' ||
      this.password_confirmation === ''
    ) {
      this.error = 'All fields are required';
    }
    else if (this.password !== this.password_confirmation) {
      this.error = 'Passwords do not match';
    }
    else {
      const registerRequest: RegisterRequest = {
        username: this.username,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation
      }
      
      this.laravelApiService.register(registerRequest).subscribe((data) => {
        window.location.href='/gear';
      });
    }
  }
}
