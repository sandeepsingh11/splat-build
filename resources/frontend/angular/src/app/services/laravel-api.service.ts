import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WeaponResponse, SkillResponse, BaseGearResponse, SaveGearRequest, LoginRequest, RegisterRequest, ResetPasswordRequest, GearCountResponse } from '../types';

@Injectable({
  providedIn: 'root'
})
export class LaravelApiService {

  constructor(private http: HttpClient) { }

  forgotPasswordUrl: string = 'api/forgot-password';
  getBaseGearsUrl: string = 'api/get-base-gears';
  getGearCountUrl: string = 'api/get-gear-count';
  getSkillsNameUrl: string = 'api/get-skill-names';
  getWeaponsUrl: string = 'api/get-weapons';
  registerUrl: string = 'api/register';
  resetPasswordUrl: string = 'api/reset-password';
  saveGearUrl: string = 'api/save-gear'

  forgotPassword(email: any): Observable<any> {
    return this.http.post<any>(this.forgotPasswordUrl, email);
  }

  getBaseGears(): Observable<BaseGearResponse[]> {
    return this.http.get<BaseGearResponse[]>(this.getBaseGearsUrl);
  }

  getGearCount(): Observable<GearCountResponse[]> {
    return this.http.get<GearCountResponse[]>(this.getGearCountUrl);
  }

  getSkillNames(): Observable<SkillResponse[]> {
    return this.http.get<SkillResponse[]>(this.getSkillsNameUrl);
  }

  getWeapons(): Observable<WeaponResponse[]> {
    return this.http.get<WeaponResponse[]>(this.getWeaponsUrl);
  }

  register(credentials: RegisterRequest): Observable<any> {
    return this.http.post<any>(this.registerUrl, credentials);
  }

  resetPassword(credentials: ResetPasswordRequest): Observable<any> {
    return this.http.post<any>(this.resetPasswordUrl, credentials);
  }

  saveGear(newGear: SaveGearRequest): Observable<SaveGearRequest> {
    return this.http.post<SaveGearRequest>(this.saveGearUrl, newGear);
  }
}
