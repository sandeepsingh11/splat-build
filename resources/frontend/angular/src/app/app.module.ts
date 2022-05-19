import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DemoComponent } from './pages/demo/demo.component';
import { GearFormComponent } from './pages/gear/gear-form/gear-form.component';
import { SearchSelectComponent } from './comp/search-select/search-select.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    GearFormComponent,
    SearchSelectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
