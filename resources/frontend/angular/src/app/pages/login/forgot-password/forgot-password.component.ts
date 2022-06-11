import { Component, OnInit } from '@angular/core';
import { LaravelApiService } from 'src/app/services/laravel-api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private laravelApiService: LaravelApiService) { }

  ngOnInit(): void {
  }

  email: string = '';

  success: string = '';
  error: string = '';

  onSubmit() {
    if (this.email === '') {
      this.error = 'Email is required';
    }
    else {
      const forgotPwRequest = {
        email: this.email
      };
      this.laravelApiService.forgotPassword(forgotPwRequest).subscribe((data) => {
        console.log(data.success !== undefined);
        if (data.success !== undefined) {
          this.success = data.success;
          this.error = '';
        }
        else if (data.error !== undefined) {
          this.error = data.error;
          this.success = '';
        }
      });
    }
  }
}
