import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SkillBubbleOutput } from 'src/app/types';

@Component({
  selector: 'app-skill-bubble',
  templateUrl: './skill-bubble.component.html',
  styleUrls: ['./skill-bubble.component.scss']
})
export class SkillBubbleComponent implements OnChanges {

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.skillName = (changes['skillName'] !== undefined)
      ? changes['skillName'].currentValue
      : this.skillName;
    // since gear-form (parent) is passing array, if 1 index changes,
    // all 4 bubbles reload, which may not have a "changes" index.
  }

  @Input() skillName: string = 'Unknown';
  @Input() isMain!: boolean;
  @Input() skillNumber!: number;
  @Output() bubbleClicked: EventEmitter<SkillBubbleOutput> = new EventEmitter();

  skillBubbleClicked() {
    this.bubbleClicked.emit({skillNumber: this.skillNumber});
  }
}
