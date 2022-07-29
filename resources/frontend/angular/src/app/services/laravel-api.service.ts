import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WeaponResponse, SkillResponse, BaseGearResponse, SaveGearRequest, RegisterRequest, ResetPasswordRequest, Gear, GearStatsResponse } from '../types';

@Injectable({
  providedIn: 'root'
})
export class LaravelApiService {

  constructor(private http: HttpClient) { }

  forgotPasswordUrl: string = 'api/forgot-password';
  getBaseGearsUrl: string = 'api/get-base-gears';
  getGearStatsUrl: string = 'api/get-gear-stats';
  getRecentGearsUrl: string = 'api/get-recent-gears';
  getSkillsNameUrl: string = 'api/get-skill-names';
  getWeaponsUrl: string = 'api/get-weapons';
  registerUrl: string = 'api/register';
  resetPasswordUrl: string = 'api/reset-password';
  saveGearUrl: string = 'api/save-gear';

  forgotPassword(email: any): Observable<any> {
    return this.http.post<any>(this.forgotPasswordUrl, email);
  }

  getBaseGears(): Observable<BaseGearResponse[]> {
    return this.http.get<BaseGearResponse[]>(this.getBaseGearsUrl);
  }
  
  getGearStats(): Observable<GearStatsResponse> {
    return this.http.get<GearStatsResponse>(this.getGearStatsUrl);
  }

  getRecentGears(): Observable<Gear[]> {
    return this.http.get<Gear[]>(this.getRecentGearsUrl);
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
