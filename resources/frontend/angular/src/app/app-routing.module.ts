import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GearFormComponent } from "./pages/gear/gear-form/gear-form.component";
import { LoginComponent } from './pages/login/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'gear', component: GearFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
