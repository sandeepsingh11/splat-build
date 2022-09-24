import { Component, OnInit } from '@angular/core';

import { LaravelApiService } from 'src/app/services/laravel-api.service';
import { UserService } from 'src/app/services/user.service';
import { Gear, Gearset, GearStatsResponse, User } from 'src/app/types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private _laravelApiService: LaravelApiService,
    private _userService: UserService
  ) { }

  ngOnInit(): void {
    this.user = this._userService.user!;

    // get gear stats
    this._laravelApiService.getGearStats().subscribe((data) => {
      this.gearStats = data;

      this.gearStatsDisplay = Object.entries(this.gearStats);
    });

    // get recent gears
    this._laravelApiService.getRecentGears().subscribe((gears) => {
      this.recentGears = gears;
    });

    // get recent gearsets
    this._laravelApiService.getRecentGearsets().subscribe((gearsets) => {
      this.recentGearset = gearsets[0];

      if (this.recentGearset.gearset_title === null) this.recentGearset.gearset_title = '(no title)';
      if (this.recentGearset.gearset_desc === null) this.recentGearset.gearset_desc = '(no description)';

      // order gears by type
      let orderedGears: Gear[] = [];
      if (this.recentGearset.gears != null && this.recentGearset.gears.length > 0) {
        this.recentGearset.gears.forEach(gear => {
          if (gear.base_gear_name.includes('Hed')) orderedGears[0] = gear;
          else if (gear.base_gear_name.includes('Clt')) orderedGears[1] = gear;
          else if (gear.base_gear_name.includes('Shs')) orderedGears[2] = gear;
        });

        this.recentGearset.gears = orderedGears;
      }
    });
  }

  user!: User;
  gearStats: GearStatsResponse = {
    'head': 0,
    'clothes': 0,
    'shoes': 0,
    'gears': 0,
    'gearsets': 0,
  };
  // JS alphabetizes the above object automatically. So instead
  // I'm creating the array below to keep the key order
  gearStatsDisplay: [string, any][] = Object.entries(this.gearStats);
  recentGears: Gear[] = [];
  recentGearset: Gearset = {
    gearset_title: '(no title)',
    gearset_desc: '(no description)',
    gearset_mode_rm: false,
    gearset_mode_cb: false,
    gearset_mode_sz: false,
    gearset_mode_tc: false,
    created_at: '',
    updated_at: '',
    weapon_name: '',
    weapon_class: '',
    special_name: '',
    sub_name: '',
  };
}
