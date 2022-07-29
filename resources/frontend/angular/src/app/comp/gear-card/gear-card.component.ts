import { Component, Input, OnInit } from '@angular/core';
import { Gear } from 'src/app/types';

@Component({
  selector: 'app-gear-card',
  templateUrl: './gear-card.component.html',
  styleUrls: ['./gear-card.component.scss']
})
export class GearCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    if (this.gear!.gear_title === null) this.gear!.gear_title = '(no title)';
    if (this.gear!.gear_desc === null) this.gear!.gear_desc = '(no description)';
  }

  @Input() gear!: Gear;
}
