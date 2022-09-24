import { Component, Input, OnInit } from '@angular/core';
import { Gearset } from 'src/app/types';

@Component({
  selector: 'app-gearset-card',
  templateUrl: './gearset-card.component.html',
  styleUrls: ['./gearset-card.component.scss']
})
export class GearsetCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

  @Input() gearset!: Gearset;
}
