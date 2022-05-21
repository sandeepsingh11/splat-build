import { Component, OnInit } from '@angular/core';

import { LeanCalcService } from "../../../services/lean-calc.service";
import { LeanDataService } from "../../../services/lean-data.service";
import { BaseGearResponse, SearchSelectOutput, SkillIconOutput, SkillResponse, WeaponResponse } from "../../../types";

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
  activeSkillNames: string[] = ['Unknown', 'Unknown', 'Unknown', 'Unknown'];

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

  iconClicked(skillIconOutput: SkillIconOutput) {
    const availableSkillBubble: number = this.getNextAvailableSkillBubble();

    if (availableSkillBubble > 0) {
      // if non-main bubble available, dont allow main-skill
      if (availableSkillBubble !== 1) {
        if (!skillIconOutput.isMain) {
          this.activeSkillNames[availableSkillBubble - 1] = skillIconOutput.skillName;    
        }
      }
      else {
        this.activeSkillNames[0] = skillIconOutput.skillName;
      }
    }
  }

  getNextAvailableSkillBubble(): number {
    if (this.activeSkillNames[0] === 'Unknown') return 1;
    else if (this.activeSkillNames[1] === 'Unknown') return 2;
    else if (this.activeSkillNames[2] === 'Unknown') return 3;
    else if (this.activeSkillNames[3] === 'Unknown') return 4;
    else return -1;
  }
}
