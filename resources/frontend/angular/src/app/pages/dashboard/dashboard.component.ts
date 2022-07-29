import { Component, OnInit } from '@angular/core';

import { LaravelApiService } from 'src/app/services/laravel-api.service';
import { UserService } from 'src/app/services/user.service';
import { Gear, GearStatsResponse, User } from 'src/app/types';

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
    this._laravelApiService.getRecentGears().subscribe((data) => {
      this.recentGears = data;
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
}
