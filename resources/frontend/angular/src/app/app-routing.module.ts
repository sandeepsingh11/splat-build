import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GearFormComponent } from "./pages/gear/gear-form/gear-form.component";
import { ForgotPasswordComponent } from './pages/login/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/login/login/login.component';
import { RegistrationComponent } from './pages/login/registration/registration.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'gear', component: GearFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
