import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gearset-weapon',
  templateUrl: './gearset-weapon.component.html',
  styleUrls: ['./gearset-weapon.component.scss']
})
export class GearsetWeaponComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() weaponName = '';
  @Input() specialName = '';
  @Input() subName = '';
}
