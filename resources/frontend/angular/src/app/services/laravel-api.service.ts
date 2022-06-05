import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WeaponResponse, SkillResponse, BaseGearResponse, SaveGearRequest, LoginRequest } from '../types';

@Injectable({
  providedIn: 'root'
})
export class LaravelApiService {

  constructor(private http: HttpClient) { }

  getBaseGearsUrl: string = 'api/get-base-gears';
  getSkillsNameUrl: string = 'api/get-skill-names';
  getWeaponsUrl: string = 'api/get-weapons';
  loginUrl: string = 'api/login';
  saveGearUrl: string = 'api/save-gear'

  getBaseGears(): Observable<BaseGearResponse[]> {
    return this.http.get<BaseGearResponse[]>(this.getBaseGearsUrl);
  }

  getSkillNames(): Observable<SkillResponse[]> {
    return this.http.get<SkillResponse[]>(this.getSkillsNameUrl);
  }

  getWeapons(): Observable<WeaponResponse[]> {
    return this.http.get<WeaponResponse[]>(this.getWeaponsUrl);
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(this.loginUrl, credentials);
  }

  saveGear(newGear: SaveGearRequest): Observable<SaveGearRequest> {
    return this.http.post<SaveGearRequest>(this.saveGearUrl, newGear);
  }
}
