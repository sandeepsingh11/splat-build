import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LaravelApiService } from 'src/app/services/laravel-api.service';
import { ResetPasswordRequest } from 'src/app/types';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _laravelApiService: LaravelApiService
  ) { }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((params) => {
      this.token = params.get('token');
      this.email = this._activatedRoute.snapshot.queryParams['email'];
    })
  }

  token: string | null = '';
  email: string = '';
  password: string = '';
  password_confirmation: string = '';

  success: string = '';
  error: string = '';

  onSubmit() {
    if (
      this.token === null ||
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
      const resetPwRequest: ResetPasswordRequest = {
        token: this.token,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation
      }
      
      this._laravelApiService.resetPassword(resetPwRequest).subscribe((data) => {
        if (data.success !== undefined) {
          this.success = data.success;
          this.error = '';
        }
        else if (data.error !== undefined) {
          this.error = data.error;
          this.success = '';
        }

        // wait few seconds so user sees success message before redirect
        setTimeout(() => {
          window.location.href='/gear';
        }, 1500);
      });
    }
  }
}
