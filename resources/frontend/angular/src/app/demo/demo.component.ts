import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { LeanCalcService } from "../services/lean-calc.service";

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  constructor(private leanCalcService: LeanCalcService) { }

  ngOnInit(): void {
  }

  test() {
    // this.http.get('/api/test').subscribe(data => console.log(data));
    // console.log(this.leanDataService.weapons);
    // console.log(this.leanDataService.subs);
    // console.log(this.leanDataService.specials);
    // console.log(this.leanDataService.currentWeapon);
    this.leanCalcService.calcIsm();
  }
}
