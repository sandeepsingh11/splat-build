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
import { RegistrationComponent } from './pages/login/registration/registration.component';
import { ForgotPasswordComponent } from './pages/login/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/login/reset-password/reset-password.component';
import { NavbarComponent } from './comp/navbar/navbar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GearCardComponent } from './comp/gear-card/gear-card.component';
import { GearCardSkillComponent } from './comp/gear-card/gear-card-skill/gear-card-skill.component';
import { ButtonLinkComponent } from './comp/button-link/button-link.component';
import { GearsetCardComponent } from './comp/gearset-card/gearset-card.component';
import { GearsetModesComponent } from './comp/gearset-modes/gearset-modes.component';
import { GearsetWeaponComponent } from './comp/gearset-weapon/gearset-weapon.component';

@NgModule({
  declarations: [
    AppComponent,
    GearFormComponent,
    SearchSelectComponent,
    SkillIconComponent,
    SkillBubbleComponent,
    StatEffectComponent,
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    NavbarComponent,
    DashboardComponent,
    GearCardComponent,
    GearCardSkillComponent,
    ButtonLinkComponent,
    GearsetCardComponent,
    GearsetModesComponent,
    GearsetWeaponComponent
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
