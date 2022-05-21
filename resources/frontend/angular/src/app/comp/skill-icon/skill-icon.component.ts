import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { SkillIconOutput, SkillResponse } from 'src/app/types';

@Component({
  selector: 'app-skill-icon',
  templateUrl: './skill-icon.component.html',
  styleUrls: ['./skill-icon.component.scss']
})
export class SkillIconComponent implements OnChanges {

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.skill = changes['skill'].currentValue;
  }

  @Input() skill!: SkillResponse;
  @Output() iconClicked: EventEmitter<SkillIconOutput> = new EventEmitter();

  skillClicked(e: Event) {
    const skillName = (e.target as HTMLImageElement).alt;
    this.iconClicked.emit({skillName, isMain: this.skill.is_main});
  }
}
