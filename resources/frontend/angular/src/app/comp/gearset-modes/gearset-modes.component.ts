import { Component, Input, OnInit } from '@angular/core';
import { Gearset } from 'src/app/types';

@Component({
  selector: 'app-gearset-modes',
  templateUrl: './gearset-modes.component.html',
  styleUrls: ['./gearset-modes.component.scss']
})
export class GearsetModesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() gearset!: Gearset;
}
