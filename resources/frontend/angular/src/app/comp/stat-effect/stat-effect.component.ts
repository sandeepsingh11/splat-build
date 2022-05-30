import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Effect } from 'src/app/types';

@Component({
  selector: 'app-stat-effect',
  templateUrl: './stat-effect.component.html',
  styleUrls: ['./stat-effect.component.scss']
})
export class StatEffectComponent implements OnChanges {

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.effect = changes['effect'].currentValue;
  }

  ngOnInit(): void {
  }

  @Input() effect!: Effect;
}
