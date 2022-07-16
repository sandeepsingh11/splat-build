import { Component, OnInit } from '@angular/core';

import { LaravelApiService } from 'src/app/services/laravel-api.service';
import { UserService } from 'src/app/services/user.service';
import { GearCountResponse, User } from 'src/app/types';

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

    this._laravelApiService.getGearCount().subscribe((data) => {
      data.forEach((gearCount, i: number) => {
        this.gearCounts[i].count = gearCount.count;
      });
    });
  }

  user!: User;
  gearCounts: GearCountResponse[] = [
    {name: 'head', count: 0},
    {name: 'clothes', count: 0},
    {name: 'shoes', count: 0},
    {name: 'total', count: 0}
  ];
}
