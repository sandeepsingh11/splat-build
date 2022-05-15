import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { LeanCalcService } from "../../../services/lean-calc.service";
import { LeanDataService } from "../../../services/lean-data.service";

@Component({
  selector: 'app-gear-form',
  templateUrl: './gear-form.component.html',
  styleUrls: ['./gear-form.component.scss']
})
export class GearFormComponent implements OnInit {

  constructor(private leanDataService: LeanDataService) { 
    this.leanDataService.getSkillNames().subscribe((data) => {
      this.skills = data;
      this.skills.forEach((skill: {skill_name: string, is_main: boolean}) => {
        if (skill.is_main) this.mainSkills.push(skill);
        else this.otherSkills.push(skill);
      });
    });

    this.gearForm = this.createForm();
  }

  ngOnInit(): void { }

  skills!: {skill_name: string, is_main: boolean}[];
  mainSkills: {skill_name: string, is_main: boolean}[] = [];
  otherSkills: {skill_name: string, is_main: boolean}[] = [];
  gearForm: FormGroup;
  title: string = 'Create Gear';

  createForm() {
    return new FormGroup({
      gear_title: new FormControl(''),
      gear_desc: new FormControl(''),
    })
  }
}
