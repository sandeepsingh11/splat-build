import { Component, OnInit } from '@angular/core';

import { LeanCalcService } from "../../../services/lean-calc.service";
import { LeanDataService } from "../../../services/lean-data.service";
import { BaseGearResponse, SearchSelectOutput, SkillResponse, WeaponResponse } from "../../../types";

@Component({
  selector: 'app-gear-form',
  templateUrl: './gear-form.component.html',
  styleUrls: ['./gear-form.component.scss']
})
export class GearFormComponent implements OnInit {

  constructor(private leanDataService: LeanDataService) { 
    // get skill names
    this.leanDataService.getSkillNames().subscribe((data) => {
      this.skills = data;
      this.skills.forEach((skill: SkillResponse) => {
        if (skill.is_main) this.mainSkills.push(skill);
        else this.otherSkills.push(skill);
      });
    });

    // get gears
    this.leanDataService.getBaseGears().subscribe((data) => {
      this.baseGears = data;
    });

    // get weapons
    this.leanDataService.getWeapons().subscribe((data) => {
      this.weapons = data;
    });
  }

  ngOnInit(): void { }

  skills!: SkillResponse[];
  mainSkills: SkillResponse[] = [];
  otherSkills: SkillResponse[] = [];
  baseGears!: BaseGearResponse[];
  weapons!: WeaponResponse[];
  title: string = 'Create Gear';
  selectedGear: string = 'Hed_FST000';
  gearDisplayName: string = 'White Headband'
  selectedWeapon: string = 'Shooter_Short_00';
  weaponDisplayName: string = 'Sploosh-o-matic'
  subName: string = 'Bomb_Curling';
  specialName: string = 'SuperLanding';
  skillMain: string = 'Unknown';
  skill1: string = 'Unknown';
  skill2: string = 'Unknown';
  skill3: string = 'Unknown';

  updateSelectedValue(selectedValue: SearchSelectOutput) {
    if (selectedValue.type === 'gear') {
      this.selectedGear = selectedValue.selectedItem;
      this.gearDisplayName = selectedValue.displayName;
    }
    else {
      this.selectedWeapon = selectedValue.selectedItem;
      this.weaponDisplayName = selectedValue.displayName;
      this.subName = selectedValue.subName!;
      this.specialName = selectedValue.specialName!;
    }
  }
}
