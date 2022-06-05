import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GearFormComponent } from './pages/gear/gear-form/gear-form.component';
import { SearchSelectComponent } from './comp/search-select/search-select.component';
import { SkillIconComponent } from './comp/skill-icon/skill-icon.component';
import { SkillBubbleComponent } from './comp/skill-bubble/skill-bubble.component';
import { StatEffectComponent } from './comp/stat-effect/stat-effect.component';
import { LoginComponent } from './pages/login/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    GearFormComponent,
    SearchSelectComponent,
    SkillIconComponent,
    SkillBubbleComponent,
    StatEffectComponent,
    LoginComponent
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
