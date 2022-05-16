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
      this.baseGearFilteredList = data;
    });
  }

  ngOnInit(): void { }

  skills!: SkillResponse[];
  mainSkills: SkillResponse[] = [];
  otherSkills: SkillResponse[] = [];
  baseGears!: BaseGearResponse[];
  baseGearFilteredList: BaseGearResponse[] = [];
  title: string = 'Create Gear';
  selectedGear: string = 'Hed_FST000';
  skillMain: string = 'Unknown';
  skill1: string = 'Unknown';
  skill2: string = 'Unknown';
  skill3: string = 'Unknown';
  searchTerm: string = '';

  // filter gear list by search term
  search(e: Event): void {
    this.searchTerm = (e.target as HTMLInputElement).value;

    // if search term is empty, set default
    if (this.searchTerm === '') {
      this.baseGearFilteredList = this.baseGears;
      this.selectedGear = this.baseGears[0].base_gear_name;
      return;
    }

    // filter
    this.baseGearFilteredList = this.baseGears.filter((gear: BaseGearResponse) => {
      return (gear.display_name.toLocaleLowerCase().indexOf(this.searchTerm.toLocaleLowerCase()) > -1);
    });

    // set selected gear
    if (this.baseGearFilteredList.length > 0) this.selectedGear = this.baseGearFilteredList[0].base_gear_name;
    else this.selectedGear = this.baseGears[0].base_gear_name;
  }
}
