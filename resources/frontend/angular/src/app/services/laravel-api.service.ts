import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WeaponResponse, SkillResponse, BaseGearResponse } from '../types';

@Injectable({
  providedIn: 'root'
})
export class LaravelApiService {

  constructor(private http: HttpClient) { }

  getBaseGearsUrl: string = 'api/get-base-gears';
  getSkillsNameUrl: string = 'api/get-skill-names';
  getWeaponsUrl: string = 'api/get-weapons';

  getBaseGears(): Observable<BaseGearResponse[]> {
    return this.http.get<BaseGearResponse[]>(this.getBaseGearsUrl);
  }

  getSkillNames(): Observable<SkillResponse[]> {
    return this.http.get<SkillResponse[]>(this.getSkillsNameUrl);
  }

  getWeapons(): Observable<WeaponResponse[]> {
    return this.http.get<WeaponResponse[]>(this.getWeaponsUrl);
  }
}
