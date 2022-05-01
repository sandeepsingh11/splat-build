import { Injectable } from '@angular/core';

import { LeanDataService } from "./lean-data.service";

@Injectable({
  providedIn: 'root'
})
export class LeanCalcService {

  constructor(private leanDataService: LeanDataService) { }

  calcIsm() {
    console.log('start calcIsm()');
    let skillObj: any = [];
    const obj: any = {
      'skillName' : 'MainInk_Save',
      'main': 1,
      'subs': 0
    }
    skillObj.push(obj);

    const ismStats = this.leanDataService.skills![skillObj[0].skillName];
    const weapon = this.leanDataService.currentWeapon;
    const weaponName: string = weapon![0]["Name"];


    // get ink consume val
    let inkConsume = 0;
    if (weaponName.includes('Roller')) {
      inkConsume = weapon[2].mInkConsumeSplash;
    }
    else {
      if (weaponName.includes('Charger')) {
        inkConsume = weapon[1].mFullChargeInkConsume || weapon[1].mInkConsume;
      }
      else {
        inkConsume = weapon[1].mInkConsume;
      }
    }


    // prep values to calc
    let key = '';
    if (weapon[0].InkSaverLv == 'Low') key = 'ConsumeRt_Main_Low';
    else if (weapon[0].InkSaverLv == 'High') key = 'ConsumeRt_Main_High';
    else key = 'ConsumeRt_Main';

    // calc
    const consumeRateHML = this.getHML(ismStats, key);
    const consumeRateVal = this.calculateAbilityEffect(skillObj[0].main, skillObj[0].subs, consumeRateHML[0], consumeRateHML[1], consumeRateHML[2]);

    const inkTankSize = weapon[1].mInkMagazineRatio || 1.0;


    const mainInkSaveObj = {
      name: 'MainInk_Save',
      displayName: 'Ink Saver - Main',
      effects: [
        {
          name: 'Ink Consumption / Shot',
          value: parseInt((consumeRateVal[0] * inkConsume).toFixed(5)),
          percent: parseInt((consumeRateVal[1] * 100).toFixed(2))
        },
        {
          name: 'Max Number of Shots',
          value: Math.floor(inkTankSize / (consumeRateVal[0] * inkConsume)),
          percent: parseInt((consumeRateVal[1] * 100).toFixed(2))
        }
      ]
    }

    // displayStat(mainInkSaveObj);
    console.log(mainInkSaveObj);
  }

  // get high, mid, and low values
  getHML(data: any, key: string) {
    let high = 0
    let mid = 0
    let low = 0

    if ((key + "_High") in data) {
      high = data[key + "_High"]
      mid = data[key + "_Mid"]
      low = data[key + "_Low"] || data[key] || 0.0
    } else if ((key + "High") in data) {
      high = data[key + "High"]
      mid = data[key + "Mid"]
      low = data[key + "Low"] || data[key] || 1.0
    } else {
      high = data[key + "H"]
      mid = data[key + "M"]
      low = data[key + "L"] || data[key] || 1.0
    }

    return [high, mid, low]
  }

  // get the value of an ability's effect value with the current gear's skills
  calculateAbilityEffect(
    numOfMains: number, 
    numOfSubs: number, 
    high: number, 
    mid: number, 
    low: number, 
    ninjaSquid: boolean = false
  ) {
    var APs = this.getAPs(numOfMains, numOfSubs);
    var percentage = this.getPercentage(APs);
    if (ninjaSquid) percentage *= 0.8;
    var slope = this.getSlope(high, mid, low);
    var lerpN = this.getLerpN(percentage / 100, slope);
    var result = this.getResult(high, low, lerpN);
    if (ninjaSquid) result *= 0.9;
    console.log(numOfMains, numOfSubs, high, mid, low, ninjaSquid);
    console.log(APs, percentage, slope, lerpN, result);

    return [result, lerpN];
  }

  // main, sub to AP points
  getAPs(numOfMains: number, numOfSubs: number) {
    return (10 * numOfMains) + (3 * numOfSubs);
  }

  // percent difference
  getPercentage(AP: number) {
    return Math.min( (3.3 * AP) - (0.027 * Math.pow(AP, 2)), 100 );
  }

  // slope
  getSlope(high: number, mid: number, low: number) {
    if (mid == low) return 0;

    return (mid - low) / (high - low);
  }

  // lerpN
  getLerpN(percentage: number, slope: number) {
    if (
      parseInt(slope.toFixed(3)) == 0.5 ||
      percentage === 0.0 ||
      percentage === 1.0
    ) {
        return percentage;
    }
    else { // slope != 0.5
        return Math.pow( Math.E, -1 * (Math.log(percentage) * Math.log(slope) / Math.log(2)) );
    }
  }

  // result
  getResult(high: number, low: number, lerpN: number) {
    return low + (high - low) * lerpN;
  }
}
