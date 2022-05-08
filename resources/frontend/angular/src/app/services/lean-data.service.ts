import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { json } from "../types/json";

@Injectable({
  providedIn: 'root'
})
export class LeanDataService {
  version: string = '550';
  storageUrl: string = '/storage/' + this.version + '/';
  weaponsUrl: string = this.storageUrl + 'parsed-weapons.json';
  subsSpecialsUrl: string = this.storageUrl + 'parsed-subs-specials.json';
  skillsUrl: string = this.storageUrl + 'parsed-skills.json';

  weapons?: any;
  subs?: any;
  specials?: any;
  skills?: any;
  currentWeapon?: any;
  currentSub?: any;
  currentSpecial?: any;

  constructor(private http: HttpClient) { this.loadData() }

  loadData() {
    this.getWeapons();
    this.getSubsAndSpecial();
    this.getSkills();
  }

  getWeapons(): void {
    this.http.get(this.weaponsUrl).subscribe((data: any) => {
      this.weapons = data;
      
      // set default weapon
      this.setCurrentWeapon('Shooter_BlasterLight_00');
    });
  }

  getSubsAndSpecial() {
    this.http.get(this.subsSpecialsUrl).subscribe((data: any) => {
      this.subs = data.subs;
      this.specials = data.specials;
      
      // set default sub
      this.setCurrentSub('Bomb_Curling');

      // set default special
      this.setCurrentSpecial('SuperLanding');
    });
  }

  getSkills() {
    this.http.get(this.skillsUrl).subscribe((data: any) => {
      this.skills = data;
      console.log('skills set');
    });
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
}
