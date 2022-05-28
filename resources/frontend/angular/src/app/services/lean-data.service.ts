import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from 'rxjs';

import { json } from "../types/json";

@Injectable({
  providedIn: 'root'
})
export class LeanDataService {
  version: string = '550';
  storageUrl: string = '/storage/' + this.version + '/';
  weaponStatsUrl: string = this.storageUrl + 'parsed-weapons.json';
  subsSpecialStatsUrl: string = this.storageUrl + 'parsed-subs-specials.json';
  skillStatsUrl: string = this.storageUrl + 'parsed-skills.json';

  weapons: any;
  subs: any;
  specials: any;
  skills: any;
  currentWeapon: any;
  currentSub: any;
  currentSpecial: any;

  constructor(private http: HttpClient) { }

  loadWeaponStats(): Observable<any> {
    return this.http.get(this.weaponStatsUrl).pipe(
      tap((data: any) => {
        this.weapons = data;
        
        // set default weapon
        this.setCurrentWeapon('Shooter_Short_00');
      })
    );
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

  loadSubSpecialStats(): Observable<any> {
    return this.http.get(this.subsSpecialStatsUrl).pipe(
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

  loadSkillStats(): Observable<any> {
    return this.http.get(this.skillStatsUrl).pipe(
      tap((data) => {
        this.skills = data;
      })
    );
  }

  setCurrentSub(subName: string) {
    this.currentSub = this.subs![subName];
  }

  setCurrentSpecial(specialName: string) {
    this.currentSpecial = this.specials![specialName];
  }
}
