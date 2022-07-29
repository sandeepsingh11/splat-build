import { Component, Input, OnInit } from '@angular/core';

import { SkillResponse } from 'src/app/types';

@Component({
  selector: 'app-gear-card-skill',
  templateUrl: './gear-card-skill.component.html',
  styleUrls: ['./gear-card-skill.component.scss']
})
export class GearCardSkillComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.imgSize = (this.skill.skill_type === 'Main') ? 64 : 50;
  }

  @Input() skill!: SkillResponse;
  imgSize = 50;
}
