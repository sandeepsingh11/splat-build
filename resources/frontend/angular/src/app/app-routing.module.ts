import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DemoComponent } from "./pages/demo/demo.component";
import { GearFormComponent } from "./pages/gear/gear-form/gear-form.component";

const routes: Routes = [
  { path: 'demo', component: DemoComponent },
  { path: 'gear', component: GearFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
