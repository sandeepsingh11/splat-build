import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { LeanCalcService } from "../../services/lean-calc.service";

export type skillObj = {
  skillName: string,
  main: number,
  subs: number
}

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  constructor(private leanCalcService: LeanCalcService) { this.skillObj.push(this.obj); }

  ngOnInit(): void {
  }

  skillObj: skillObj[] = [];
  obj: skillObj = {
    'skillName' : 'MainInk_Save',
    'main': 2,
    'subs': 0
  }

  test() {
    // this.http.get('/api/test').subscribe(data => console.log(data));
    // console.log(this.leanDataService.weapons);
    // console.log(this.leanDataService.subs);
    // console.log(this.leanDataService.specials);
    // console.log(this.leanDataService.currentWeapon);
    this.leanCalcService.calcIsm(this.skillObj[0]);
  }
}
