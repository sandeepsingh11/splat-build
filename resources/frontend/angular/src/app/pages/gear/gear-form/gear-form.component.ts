import { Component, OnInit } from '@angular/core';
import { LaravelApiService } from 'src/app/services/laravel-api.service';

import { LeanCalcService } from "../../../services/lean-calc.service";
import { ActiveSkill, BaseGearResponse, SaveGearRequest, SearchSelectOutput, SkillBubbleOutput, SkillIconOutput, SkillResponse, Stats, WeaponResponse } from "../../../types";

@Component({
  selector: 'app-gear-form',
  templateUrl: './gear-form.component.html',
  styleUrls: ['./gear-form.component.scss']
})
export class GearFormComponent implements OnInit {

  constructor(
    private leanCalcService: LeanCalcService,
    private laravelApiService: LaravelApiService
  ) { 
    // get skill names
    this.laravelApiService.getSkillNames().subscribe((data) => {
      this.skills = data;
      this.skills.forEach((skill: SkillResponse) => {
        if (skill.is_main) this.mainSkills.push(skill);
        else this.otherSkills.push(skill);
      });
    });

    // get gears
    this.laravelApiService.getBaseGears().subscribe((data) => {
      this.baseGears = data;
    });

    // get weapons
    this.laravelApiService.getWeapons().subscribe((data) => {
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
  gearTitle: string = '';
  gearDesc: string = '';

  selectedGear: string = 'Hed_FST000';
  gearDisplayName: string = 'White Headband'
  selectedWeapon: string = 'Shooter_Short_00';
  weaponDisplayName: string = 'Sploosh-o-matic'
  subName: string = 'Bomb_Curling';
  specialName: string = 'SuperLanding';
  activeSkillNames: string[] = ['Unknown', 'Unknown', 'Unknown', 'Unknown'];
  activeSkills: ActiveSkill[] = [];
  skillStats: Stats[] = [];

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

      this.calc();
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

      this.updateActiveSkills();
    }
  }

  getNextAvailableSkillBubble(): number {
    if (this.activeSkillNames[0] === 'Unknown') return 1;
    else if (this.activeSkillNames[1] === 'Unknown') return 2;
    else if (this.activeSkillNames[2] === 'Unknown') return 3;
    else if (this.activeSkillNames[3] === 'Unknown') return 4;
    else return -1;
  }

  updateActiveSkills() {
    let skillsChecked: string[] = [];
    this.activeSkills = [];

    this.activeSkillNames.forEach((skillName, i) => {
      if (skillName !== 'Unknown') {
        if (!skillsChecked.includes(skillName)) {
          // if skill obj does not exist, create
          this.activeSkills.push({
            skillName: skillName,
            main: (i === 0) ? 1 : 0,
            subs: (i !== 0) ? 1 : 0,
          });
        }
        else {
          // else update existing skill obj
          this.activeSkills.every((activeSkill, j) => {
            if (activeSkill.skillName === skillName) {
              this.activeSkills[j].subs++;
              return false;
            }
            return true;
          });
        }
  
        skillsChecked.push(skillName);
      }
    });

    this.calc();
  }

  skillBubbleClicked(bubbleOutput: SkillBubbleOutput) {
    this.activeSkillNames[bubbleOutput.skillNumber - 1] = 'Unknown';

    this.updateActiveSkills();
  }

  calc() {
    this.skillStats = this.leanCalcService.calc(
      this.activeSkills,
      this.selectedWeapon,
      this.subName,
      this.specialName
    );
  }

  onSubmit() {
    const gearId: number | undefined = this.baseGears.find((gear) => gear.name === this.selectedGear)?.id;
    let skillIds: number[] = [];
    this.activeSkillNames.forEach((skillName) => {
      let skillId = this.skills.find((skill) => skill.skill_name === skillName)?.id;
      if (skillId === undefined) skillId = 27;
      skillIds.push(skillId);
    });

    if (gearId !== undefined) {
      const newGear: SaveGearRequest = {
        'gearTitle': this.gearTitle,
        'gearDesc': this.gearDesc,
        'gearId': gearId,
        'skillMain': skillIds[0],
        'skillSub1': skillIds[1],
        'skillSub2': skillIds[2],
        'skillSub3': skillIds[3],
      };

      this.laravelApiService.saveGear(newGear).subscribe(() => { 
        console.log('submitted!'); 
        window.location.href='/demo';
      });
    }
  }
}
