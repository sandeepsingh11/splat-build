import { Component, OnInit } from '@angular/core';

import { LeanCalcService } from "../../../services/lean-calc.service";
import { LeanDataService } from "../../../services/lean-data.service";
import { BaseGearResponse, SkillResponse } from "../../../types";

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
  }

  ngOnInit(): void { }

  skills!: SkillResponse[];
  mainSkills: SkillResponse[] = [];
  otherSkills: SkillResponse[] = [];
  baseGears!: BaseGearResponse[];
  title: string = 'Create Gear';
  selectedGear: string = 'Hed_FST000';
  skillMain: string = 'Unknown';
  skill1: string = 'Unknown';
  skill2: string = 'Unknown';
  skill3: string = 'Unknown';
}
