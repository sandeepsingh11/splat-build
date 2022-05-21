import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { json } from "../types/json";
import { Observable, tap } from 'rxjs';
import { BaseGearResponse, SkillResponse, WeaponResponse } from '../types';

@Injectable({
  providedIn: 'root'
})
export class LeanDataService {
  version: string = '550';
  storageUrl: string = '/storage/' + this.version + '/';
  weaponsUrl: string = this.storageUrl + 'parsed-weapons.json';
  subsSpecialsUrl: string = this.storageUrl + 'parsed-subs-specials.json';
  skillsUrl: string = this.storageUrl + 'parsed-skills.json';
  getSkillsNameUrl: string = 'api/get-skill-names';
  getBaseGearsUrl: string = 'api/get-base-gears';
  getWeaponsUrl: string = 'api/get-weapons';

  weapons: any;
  subs: any;
  specials: any;
  skills: any;
  currentWeapon: any;
  currentSub: any;
  currentSpecial: any;

  constructor(private http: HttpClient) { this.loadData() }

  loadData() {
    // this.getWeapons();
    // this.getSubsAndSpecial();
    // this.getSkills();
  }

  getWeapons(): Observable<WeaponResponse[]> {
    return this.http.get<WeaponResponse[]>(this.getWeaponsUrl);
  }

  getSubsAndSpecial(): Observable<any> {
    return this.http.get(this.subsSpecialsUrl).pipe(
      tap((data: any) => {
        this.subs = data.subs;
        this.specials = data.specials;
        
        // set default sub
        this.setCurrentSub('Bomb_Curling');

        // set default special
        this.setCurrentSpecial('SuperLanding');
      })
    );
  }

  getSkills(): Observable<any> {
    console.log('skills getting');
    return this.http.get(this.skillsUrl).pipe(
      tap((data) => {
        this.skills = data;
      })
    );
  }

  getSkillNames(): Observable<SkillResponse[]> {
    return this.http.get<SkillResponse[]>(this.getSkillsNameUrl);
  }

  setCurrentWeapon(weaponName: string) {
    const weaponGroupName: string = this.getWeaponGroupName(weaponName);

    const weaponGroupData: json = this.weapons![weaponGroupName][weaponName];
    const params: json = this.weapons![weaponGroupName]['param'];

    let weapon: json[] = [weaponGroupData, params];

    if (weaponGroupName.includes("Spinner") || weaponGroupName.includes("Twins")) {
      weapon.push(this.weapons![weaponGroupName][weaponGroupName + '_2']);
    }
    else if (weaponGroupName.includes('Blaster')) {
      weapon.push(this.weapons![weaponGroupName][weaponGroupName + '_burst']);
    }
    else if (weaponGroupName.includes('Roller')) {
      weapon.push(this.weapons![weaponGroupName][weaponGroupName + '_stand']);
      weapon.push(this.weapons![weaponGroupName][weaponGroupName + '_jump']);
    }

    this.currentWeapon = weapon;
  }

  getWeaponGroupName(weaponName: string): string {
    const weaponNameSplitted: string[] = weaponName.split('_');
    let weaponGroupName: string = weaponNameSplitted[0] + weaponNameSplitted[1];

    if (weaponGroupName.includes("Blaster")) {
      weaponGroupName = weaponGroupName.substring(7);
    }

    return weaponGroupName;
  }

  setCurrentSub(subName: string) {
    this.currentSub = this.subs![subName];
  }

  setCurrentSpecial(specialName: string) {
    this.currentSpecial = this.specials![specialName];
  }

  getBaseGears(): Observable<BaseGearResponse[]> {
    return this.http.get<BaseGearResponse[]>(this.getBaseGearsUrl);
  }
}
