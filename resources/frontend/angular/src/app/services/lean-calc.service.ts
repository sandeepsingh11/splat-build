import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';

import { LeanDataService } from './lean-data.service';
import { ActiveSkill, Effect, Skill, Stats } from '../types/index';

@Injectable({
  providedIn: 'root',
})
export class LeanCalcService {
  constructor(private leanDataService: LeanDataService) {
    forkJoin([
      leanDataService.loadWeaponStats(),
      leanDataService.loadSubSpecialStats(),
      leanDataService.loadSkillStats(),
    ])
    .subscribe(() => {
      const skills: ActiveSkill[] = [];
      this.calc(
        skills, 
        'Shooter_Short_00', 
        'Bomb_Curling', 
        'SuperLanding'
      );
    });
  }

  calc(
    skills: ActiveSkill[], 
    weaponName: string, 
    subName: string, 
    specialName: string
  ) {
    console.log('in calc');
    console.log(skills, weaponName, subName, specialName);
    // set current stat objects to use to calculate
    this.leanDataService.setCurrentWeapon(weaponName);
    this.leanDataService.setCurrentSub(subName);
    this.leanDataService.setCurrentSpecial(specialName);

    skills.forEach((skill) => {
      switch (skill.skillName) {
        case 'MainInk_Save':
          this.calcIsm(skill);
          break;
        case 'SubInk_Save':
          this.calcIss(skill);
          break;
        case 'InkRecovery_Up':
          this.calcIru(skill);
          break;
        case 'HumanMove_Up':
          this.calcRsu(skill);
          break;
        case 'SquidMove_Up':
          this.calcSsu(skill);
          break;
        case 'SpecialIncrease_Up':
          this.calcScu(skill);
          break;
        case 'RespawnSpecialGauge_Save':
          this.calcSs(skill);
          break;
        case 'MarkingTime_Reduction':
          this.calcMpu(skill);
          break;
        case 'BombDistance_Up':
          this.calcSubPu(skill);
          break;
        case 'SpecialTime_Up':
          this.calcSpu(skill);
          break;
        case 'RespawnTime_Save':
          this.calcQrs(skill);
          break;
        case 'JumpTime_Save':
          this.calcQsj(skill);
          break;
        case 'OpInkEffect_Reduction':
          this.calcInkRu(skill);
          break;
        case 'BombDamage_Reduction':
          this.calcBdu(skill);
          break;
      }
    });
  }

  calcIsm(skillObj: Skill) {
    const ismStats = this.leanDataService.skills![skillObj.skillName];
    const weapon = this.leanDataService.currentWeapon;
    const weaponName: string = weapon![0]['Name'];

    // get ink consume val
    let inkConsume = 0;
    if (weaponName.includes('Roller')) {
      inkConsume = weapon[2].mInkConsumeSplash;
    } else {
      if (weaponName.includes('Charger')) {
        inkConsume = weapon[1].mFullChargeInkConsume || weapon[1].mInkConsume;
      } else {
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
    const consumeRateVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      consumeRateHML[0],
      consumeRateHML[1],
      consumeRateHML[2]
    );

    const inkTankSize = weapon[1].mInkMagazineRatio || 1.0;

    const mainInkSaveObj: Stats = {
      name: 'MainInk_Save',
      displayName: 'Ink Saver - Main',
      effects: [
        {
          name: 'Ink Consumption / Shot',
          value: parseFloat((consumeRateVal[0] * inkConsume).toFixed(5)),
          percent: parseFloat((consumeRateVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Max Number of Shots',
          value: Math.floor(inkTankSize / (consumeRateVal[0] * inkConsume)),
          percent: parseFloat((consumeRateVal[1] * 100).toFixed(2)),
        },
      ],
    };

    this.displayStat(mainInkSaveObj);
    console.log(mainInkSaveObj);
  }

  calcIss(skillObj: Skill) {
    const issStats = this.leanDataService.skills![skillObj.skillName];

    // prep sub info
    const subData = this.leanDataService.currentSub!;
    const inkConsume = subData['param']['mInkConsume'];
    let key;

    if ('ConsumeRt_Sub_A_Low' in issStats) {
      key = 'ConsumeRt_Sub_' + subData['InkSaverType'];
    } else {
      if (subData['InkSaverLv'] == 'Middle') {
        key = 'ConsumeRt_Sub';
      } else {
        key = 'ConsumeRt_Sub_' + subData['InkSaverLv'];
      }
    }

    const consumeRateHML = this.getHML(issStats, key);
    const consumeRateVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      consumeRateHML[0],
      consumeRateHML[1],
      consumeRateHML[2]
    );

    const subInkSaveObj: Stats = {
      name: 'SubInk_Save',
      displayName: 'Ink Saver - Sub',
      effects: [
        {
          name: 'Ink Consumption',
          value: parseFloat((consumeRateVal[0] * inkConsume).toFixed(5)),
          percent: parseFloat((consumeRateVal[1] * 100).toFixed(2)),
        },
      ],
    };

    this.displayStat(subInkSaveObj);
  }

  calcIru(skillObj: Skill) {
    const iruStats = this.leanDataService.skills![skillObj.skillName];

    const squidFormHML = this.getHML(iruStats, 'RecoverFullFrm_Ink');
    const humanFormHML = this.getHML(iruStats, 'RecoverNrmlFrm_Ink');

    const squidFormVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      squidFormHML[0],
      squidFormHML[1],
      squidFormHML[2]
    );
    const humanFormVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      humanFormHML[0],
      humanFormHML[1],
      humanFormHML[2]
    );

    const inkRecoveryObj: Stats = {
      name: 'InkRecovery_Up',
      displayName: 'Ink Recovery Up',
      effects: [
        {
          name: 'Recovery Time in Ink - Frames',
          value: Math.ceil(squidFormVal[0]),
          percent: parseFloat((squidFormVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Recovery Time in Ink - Seconds',
          value: parseFloat((Math.ceil(squidFormVal[0]) / 60).toFixed(2)),
          percent: parseFloat((squidFormVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Recovery Time Standing - Frames',
          value: Math.ceil(humanFormVal[0]),
          percent: parseFloat((humanFormVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Recovery Time Standing - Seconds',
          value: parseFloat((Math.ceil(humanFormVal[0]) / 60).toFixed(2)),
          percent: parseFloat((humanFormVal[1] * 100).toFixed(2)),
        },
      ],
    };

    this.displayStat(inkRecoveryObj);
  }

  calcRsu(skillObj: Skill) {
    const rsuStats = this.leanDataService.skills![skillObj.skillName];
    const weapon = this.leanDataService.currentWeapon!;
    const baseSpeed = [1, weapon[1]['mMoveSpeed']];
    let calculatedData;
    let effects: Effect[] = [];

    if (weapon[0]['MoveVelLv'] == 'Low') {
      calculatedData = this.getHML(rsuStats, 'MoveVel_Human_BigWeapon');
    } else if (weapon[0]['MoveVelLv'] == 'High') {
      calculatedData = this.getHML(rsuStats, 'MoveVel_Human_ShortWeapon');
    } else {
      calculatedData = this.getHML(rsuStats, 'MoveVel_Human');
    }

    const calculatedDataWeapon = this.getHML(
      rsuStats,
      'MoveVelRt_Human_Shot' + (weapon[0]['ShotMoveVelType'] || '')
    );

    // run speed
    const runSpeedVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      calculatedData[0],
      calculatedData[1],
      calculatedData[2]
    );
    const runSpeedEffect: Effect = {
      name: 'Run Speed (DU/Frame)',
      value: parseFloat((runSpeedVal[0] * baseSpeed[0]).toFixed(5)),
      percent: parseFloat((runSpeedVal[1] * 100).toFixed(2))
    };
    effects.push(runSpeedEffect);

    // run speed shooting
    const runSpeedShootingVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      calculatedDataWeapon[0],
      calculatedDataWeapon[1],
      calculatedDataWeapon[2]
    );
    const runSpeedEffectShooting: Effect = {
      name: 'Run Speed (Shooting) (DU/Frame)',
      value: parseFloat((runSpeedShootingVal[0] * baseSpeed[1]).toFixed(5)),
      percent: parseFloat((runSpeedShootingVal[1] * 100).toFixed(2))
    };
    effects.push(runSpeedEffectShooting);

    const runSpeedObj: Stats = {
      name: 'HumanMove_Up',
      displayName: 'Run Speed Up',
      effects: effects,
    };

    this.displayStat(runSpeedObj);
  }

  calcSsu(skillObj: Skill) {
    const ssuStats = this.leanDataService.skills![skillObj.skillName];
    const weapon = this.leanDataService.currentWeapon!;
    let calculatedData;
    let effects: Effect[] = [];

    if (weapon[0]['MoveVelLv'] == 'Low') {
      calculatedData = this.getHML(ssuStats, 'MoveVel_Stealth_BigWeapon');
    } else if (weapon[0]['MoveVelLv'] == 'High') {
      calculatedData = this.getHML(ssuStats, 'MoveVel_Stealth_ShortWeapon');
    } else {
      calculatedData = this.getHML(ssuStats, 'MoveVel_Stealth');
    }

    // swim speed
    const swimSpeedVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      calculatedData[0],
      calculatedData[1],
      calculatedData[2]
    );
    const swimSpeedEffect: Effect = {
      name: 'Swim Speed (DU/Frame)',
      value: parseFloat(swimSpeedVal[0].toFixed(5)),
      percent: parseFloat((swimSpeedVal[1] * 100).toFixed(2)),
    };
    effects.push(swimSpeedEffect);

    // swim speed - ninja
    const swimSpeedNinjaVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      calculatedData[0],
      calculatedData[1],
      calculatedData[2],
      true
    );
    const swimSpeedEffectNinja: Effect = {
      name: 'Swim Speed (Ninja) (DU/Frame)',
      value: parseFloat(swimSpeedNinjaVal[0].toFixed(5)),
      percent: parseFloat((swimSpeedNinjaVal[1] * 100).toFixed(2)),
    };
    effects.push(swimSpeedEffectNinja);

    const swimSpeedObj: Stats = {
      name: 'SquidMove_Up',
      displayName: 'Swim Speed Up',
      effects: effects,
    };

    this.displayStat(swimSpeedObj);
  }

  calcScu(skillObj: Skill) {
    const scuStats = this.leanDataService.skills![skillObj.skillName];
    const weapon = this.leanDataService.currentWeapon!;

    const chargeUpHML = this.getHML(scuStats, 'SpecialRt_Charge');
    const chargeUpVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      chargeUpHML[0],
      chargeUpHML[1],
      chargeUpHML[2]
    );

    const chargeUpObj: Stats = {
      name: 'SpecialIncrease_Up',
      displayName: 'Special Charge Up',
      effects: [
        {
          name: 'Special Cost',
          value: Math.ceil(weapon[0]['SpecialCost'] / chargeUpVal[0]),
          percent: parseFloat((chargeUpVal[1] * 100).toFixed(2)),
        },
      ],
    };

    this.displayStat(chargeUpObj);
  }

  calcSs(skillObj: Skill) {
    const ssStats = this.leanDataService.skills![skillObj.skillName];
    const weapon = this.leanDataService.currentWeapon!;

    const specialSaveHML = this.getHML(ssStats, 'SpecialRt_Restart');
    const specialSaveVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      specialSaveHML[0],
      specialSaveHML[1],
      specialSaveHML[2]
    );

    const specialSaveObj: Stats = {
      name: 'RespawnSpecialGauge_Save',
      displayName: 'Special Saver',
      effects: [
        {
          name: 'Special Remaining',
          value: Math.ceil(weapon[0]['SpecialCost'] * specialSaveVal[0]),
          percent: parseFloat((specialSaveVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Percentage Remaining',
          value: parseFloat((100 * specialSaveVal[0]).toFixed(4)),
          percent: parseFloat((specialSaveVal[1] * 100).toFixed(2)),
        },
      ],
    };

    this.displayStat(specialSaveObj);
  }

  calcMpu(skillObj: Skill) {
    const weapon = this.leanDataService.currentWeapon!;
    let effects: Effect[] = [];

    const keys: object = {
      mBulletDamageMaxDist: 'Bullet Damage Max Distance',
      mBulletDamageMinDist: 'Bullet Damage Min Distance',
      mCanopyHP: 'Canopy HP',
      mCanopyNakedFrame: 'Canopy Recovery Time',
      mCollisionRadiusFarRate: 'Collision Radius Far',
      mCollisionRadiusMiddleRate: 'Collision Radius Middle',
      mCollisionRadiusNearRate: 'Collision Radius Near',
      mCoreDamageRate: 'Core Damage Rate',
      mCorePaintWidthHalfRate: 'Core Paint Width Half Rate',
      mDamageMaxMaxChargeRate: 'Damage Max Charge Rate',
      mDamageRate: 'Damage',
      mDashSpeed: 'Dash Speed',
      mDegBias: 'Degree Bias',
      mDegJumpBiasInterpolateRate: 'Jump Bias Interpolation Rate',
      mDegJumpBias: 'Degree Jump Bias',
      mDegJumpRandom: 'Degree Jump Random',
      mDegRandom: 'Degree Random',
      mDropSplashPaintRadiusRate: 'Drop Splash Paint Radius Rate',
      mFirstGroupBulletBoundPaintRadiusRate:
        'Group 1 Bullet Paint Radius Rate (Outer)',
      mFirstGroupBulletDamageRate: 'Group 1 Bullet Damage Rate',
      mFirstGroupBulletFirstPaintRRate: 'Group 1 Bullet Paint Radius Rate',
      mFirstGroupBurst_PaintRRate: 'Group 1 Bullet PaintR Rate',
      mFirstGroupSplashPaintRadiusRate:
        'Group 1 Bullet Splash Paint Radius Rate',
      mFirstSecondMaxChargeShootingFrameTimes: 'Splatling Max Charge Frame',
      mFullChargeDamageRate: 'Full Charge Damage',
      mFullChargeDistance: 'Full Charge Distance',
      mInitVelRate: 'Init Velocity Rate',
      mInkConsumeCoreMaxSpeed: 'Ink Consume Max Speed',
      mInkConsumeCoreMinSpeed: 'Ink Consume Min Speed',
      mKnockBackRadiusRate: 'Knock Back Radius',
      mMaxDistance: 'Max Distance',
      mMinMaxChargeDamageRate: 'Max Shooting Damage',
      mMoveSpeed: 'Move Speed',
      mSecondGroupBulletBoundPaintRadiusRate:
        'Group 2 Bullet Paint Radius Rate (Outer)',
      mSecondGroupBulletDamageRate: 'Group 2 Bullet Damage Rate',
      mSecondGroupBulletFirstPaintRRate: 'Group 2 Bullet Paint Radius Rate',
      mSecondGroupBurst_PaintRRate: 'Group 2 Bullet PaintR Rate',
      mSecondGroupSplashPaintRadiusRate:
        'Group 2 Bullet Splash Paint Radius Rate',
      mSideStepOneMuzzleDamageRate: 'Side Step One Muzzle Damage',
      mSphereSplashDropPaintRadiusRate: 'Sphere Splash Drop Paint Radius',
      mSplashDamageInsideRate: 'Splash Damage Inside Rate',
      mSplashDamageOutsideRate: 'Splash Damage Outside Rate',
      mSplashPaintRadiusRate: 'Paint Radius Rate',
      mSplashPaintRadius: 'Paint Radius',
      mThirdGroupBulletBoundPaintRadiusRate:
        'Group 3 Bullet Paint Radius Rate (Outer)',
      mThirdGroupBulletDamageRate: 'Group 3 Bullet Damage Rate',
      mThirdGroupBulletFirstPaintRRate: 'Group 3 Bullet Paint Radius Rate',
      mThirdGroupBurst_PaintRRate: 'Group 3 Bullet PaintR Rate',
      mThirdGroupSplashPaintRadiusRate:
        'Group 3 Bullet Splash Paint Radius Rate',
    };
    const dmgKeys = [
      'mDamageRate',
      'mMinMaxChargeDamageRate',
      'mFullChargeDamageRate',
      'mDamageMaxMaxChargeRate',
      'mCoreDamageRate',
      'mSideStepOneMuzzleDamageRate',
    ];
    const rates = [
      'mCollisionRadiusFarRate',
      'mCollisionRadiusMiddleRate',
      'mCollisionRadiusNearRate',
      'mKnockBackRadiusRate',
      'mSphereSplashDropPaintRadiusRate',
    ];

    Object.entries(keys).forEach(([name, translation]) => {
      if (
        name + '_MWPUG_High' in weapon[1] ||
        (weapon[2] !== undefined && name + '_MWPUG_High' in weapon[2]) ||
        (weapon[3] !== undefined && name + '_MWPUG_High' in weapon[3])
      ) {
        let mainPUHML = null;
        if (name + '_MWPUG_High' in weapon[1]) {
          mainPUHML = this.getHML_MWPUG(weapon[1], name);
        } else if (
          weapon[2] !== undefined &&
          name + '_MWPUG_High' in weapon[2]
        ) {
          mainPUHML = this.getHML_MWPUG(weapon[2], name);
        } else if (
          weapon[3] !== undefined &&
          name + '_MWPUG_High' in weapon[3]
        ) {
          mainPUHML = this.getHML_MWPUG(weapon[3], name);
        }

        if (mainPUHML![0] != mainPUHML![1]) {
          let mainPUVal = this.calculateAbilityEffect(
            skillObj.main,
            skillObj.subs,
            mainPUHML![0],
            mainPUHML![1],
            mainPUHML![2]
          );
          let eff = 0;

          if (name == 'mCanopyHP') {
            eff = Math.floor(mainPUVal[0] * 1) / 10;
          } else if (name == 'mCanopyNakedFrame') {
            eff = Math.ceil(mainPUVal[0] * 1);
          } else if (name == 'mFirstSecondMaxChargeShootingFrameTimes') {
            let f1 = weapon[2]['mFirstPeriodMaxChargeShootingFrame'];
            let f2 = weapon[2]['mSecondPeriodMaxChargeShootingFrame'];

            eff = Math.ceil(mainPUVal[0] * (f1 + f2));
          } else if (dmgKeys.includes(name)) {
            let dmg = 0;
            let dmg_max = 0;

            if (name == 'mDamageRate') {
              dmg = weapon[1]['mDamageMax'];
              dmg_max = weapon[1]['mDamage_MWPUG_Max'];
            }
            if (name == 'mDamageMaxMaxChargeRate') {
              dmg = weapon[2]['mDamageMaxMaxCharge'];
              dmg_max = weapon[2]['mDamageMaxMaxCharge_MWPUG_Max'];
            }
            if (name == 'mMinMaxChargeDamageRate') {
              dmg = weapon[1]['mMaxChargeDamage'];
              dmg_max = weapon[1]['mMinMaxChargeDamage_MWPUG_Max'];
            }
            if (name == 'mFullChargeDamageRate') {
              dmg = weapon[1]['mFullChargeDamage'];
              dmg_max = weapon[1]['mFullChargeDamage_MWPUG_Max'];
            }
            if (name == 'mCoreDamageRate') {
              dmg = weapon[1]['mCoreDamage'];
              dmg_max = weapon[1]['mCoreDamage_MWPUG_Max'];
            }
            if (name == 'mSideStepOneMuzzleDamageRate') {
              dmg = weapon[2]['mSideStepOneMuzzleDamageMax'];
              dmg_max = weapon[2]['mSideStepOneMuzzleDamage_MWPUG_Max'];
            }

            eff = Math.floor(mainPUVal[0] * dmg);
            if (eff > dmg_max) {
              eff = dmg_max;
            }
            eff = eff / 10;
          } else if (rates.includes(name)) {
            let radius = 0;
            let radius_max = 0;
            if (name == 'mCollisionRadiusFarRate') {
              radius = weapon[2]['mCollisionRadiusFar'];
              radius_max = weapon[2]['mCollisionRadiusFar_MWPUG_Max'];
            }
            if (name == 'mCollisionRadiusMiddleRate') {
              radius = weapon[2]['mCollisionRadiusMiddle'];
              radius_max = weapon[2]['mCollisionRadiusMiddle_MWPUG_Max'];
            }
            if (name == 'mCollisionRadiusNearRate') {
              radius = weapon[2]['mCollisionRadiusNear'];
              radius_max = weapon[2]['mCollisionRadiusNear_MWPUG_Max'];
            }
            if (name == 'mKnockBackRadiusRate') {
              radius = weapon[2]['mKnockBackRadius'];
              radius_max = weapon[2]['mKnockBackRadius_MWPUG_Max'];
            }
            if (name == 'mSphereSplashDropPaintRadius') {
              radius = weapon[2]['mSphereSplashDropPaintRadius'];
              radius_max = 999;
            }

            eff = parseFloat((mainPUVal[0] * radius).toFixed(5));
            if (eff > radius_max) {
              eff = radius_max;
            }
          } else {
            eff = parseFloat((mainPUVal[0] * 1).toFixed(5));
          }

          const mainPUEffect: Effect = {
            name: translation,
            value: eff,
            percent: parseFloat((mainPUVal[1] * 100).toFixed(2)),
          };
          effects.push(mainPUEffect);
        }
      }
    });

    const mainPUObj: Stats = {
      name: 'MarkingTime_Reduction',
      displayName: 'Main Power Up',
      effects: effects,
    };

    this.displayStat(mainPUObj);
  }

  calcSubPu(skillObj: Skill) {
    const weapon = this.leanDataService.currentWeapon!;
    const subName = weapon[0].Sub;

    const bru = [
      'Bomb_Splash',
      'Bomb_Suction',
      'Bomb_Quick',
      'PointSensor',
      'PoisonFog',
      'Bomb_Robo',
      'Bomb_Tako',
      'Bomb_Piyo',
    ];

    const subStats = this.leanDataService.subs![subName];
    let effects: Effect[] = [];

    if (bru.includes(subName)) {
      // case 1: bomblike object + tako + piyo + point sensors
      let calculatedData = [];

      if (subName == 'Bomb_Piyo') {
        calculatedData = this.getHML(
          this.leanDataService.skills!['BombDistance_Up'],
          'BombThrow_VelZ_BombPiyo'
        );
      } else if (subName == 'Bomb_Tako') {
        calculatedData = this.getHML(
          this.leanDataService.skills!['BombDistance_Up'],
          'BombThrow_VelZ_BombTako'
        );
      } else if (subName == 'PointSensor') {
        calculatedData = this.getHML(
          this.leanDataService.skills!['BombDistance_Up'],
          'BombThrow_VelZ_PointSensor'
        );
      } else {
        calculatedData = this.getHML(
          this.leanDataService.skills!['BombDistance_Up'],
          'BombThrow_VelZ'
        );
      }

      const result = this.calculateAbilityEffect(
        skillObj.main,
        skillObj.subs,
        calculatedData[0],
        calculatedData[1],
        calculatedData[2]
      );
      const subPUEffect: Effect = {
        name: 'Throw Velocity',
        value: parseFloat((result[0] * 1).toFixed(5)),
        percent: parseFloat((result[1] * 100).toFixed(2)),
      };
      effects.push(subPUEffect);

      // special case: PointSensor
      if ('PointSensor' == subName) {
        const calculatedData = this.getHML(subStats['param'], 'mMarkingFrame');

        const result = this.calculateAbilityEffect(
          skillObj.main,
          skillObj.subs,
          calculatedData[0],
          calculatedData[1],
          calculatedData[2]
        );
        const subPUEffect: Effect = {
          name: 'Marking Time',
          value: Math.ceil(result[0]),
          percent: parseFloat((result[1] * 100).toFixed(2)),
        };
        effects.push(subPUEffect);
      }

      const subPUObj: Stats = {
        name: 'BombDistance_Up',
        displayName: 'Sub Power Up',
        effects: effects,
      };

      this.displayStat(subPUObj);
    }

    if ('Bomb_Curling' == subName) {
      // case 2: Bomb_Curling
      const calculatedData = this.getHML(
        subStats['param'],
        'mInitVelAndBaseSpeed'
      );
      const result = this.calculateAbilityEffect(
        skillObj.main,
        skillObj.subs,
        calculatedData[0],
        calculatedData[1],
        calculatedData[2]
      );

      const subPUEffect: Effect = {
        name: 'Base Speed',
        value: parseFloat((result[0] * 1).toFixed(5)),
        percent: parseFloat((result[1] * 100).toFixed(2)),
      };
      effects.push(subPUEffect);

      const subPUObj: Stats = {
        name: 'BombDistance_Up',
        displayName: 'Sub Power Up',
        effects: effects,
      };

      this.displayStat(subPUObj);
    }

    if ('TimerTrap' == subName) {
      // case 3: TimerTrap
      const calculatedData = [
        this.getHML(subStats['param'], 'mBombCoreRadiusRate'),
        this.getHML(subStats['param'], 'mPlayerColRadius'),
        this.getHML(subStats['param'], 'mMarkingFrame'),
      ];
      for (let c = 0; c < 3; c++) {
        const result = this.calculateAbilityEffect(
          skillObj.main,
          skillObj.subs,
          calculatedData[c][0],
          calculatedData[c][1],
          calculatedData[c][2]
        );

        let eff = 0;
        if (c < 2) {
          eff = parseFloat((result[0] * 1).toFixed(5));
        } else {
          eff = Math.ceil(result[0] * 1);
        }

        let effectName;
        if (c == 0) effectName = 'Explosion Radius Rate';
        else if (c == 1) effectName = 'Marking Radius';
        else effectName = 'Marking Duration';

        const subPUEffect:Effect = {
          name: effectName,
          value: eff,
          percent: parseFloat((result[1] * 100).toFixed(2)),
        };
        effects.push(subPUEffect);
      }

      const subPUObj: Stats = {
        name: 'BombDistance_Up',
        displayName: 'Sub Power Up',
        effects: effects,
      };

      this.displayStat(subPUObj);
    }

    if ('Sprinkler' == subName) {
      // case 4: Sprinkler
      const calculatedData = [
        this.getHML(subStats['param'], 'mPeriod_First'),
        this.getHML(subStats['param'], 'mPeriod_Second'),
      ];
      for (let c = 0; c < 2; c++) {
        const result = this.calculateAbilityEffect(
          skillObj.main,
          skillObj.subs,
          calculatedData[c][0],
          calculatedData[c][1],
          calculatedData[c][2]
        );

        let effectName;
        if (c == 0) effectName = 'First Phase Duration';
        else effectName = 'Second Phase Duration';

        const subPUEffect: Effect = {
          name: effectName,
          value: Math.ceil(result[0] * 1),
          percent: parseFloat((result[1] * 100).toFixed(2)),
        };
        effects.push(subPUEffect);
      }

      const subPUObj: Stats = {
        name: 'BombDistance_Up',
        displayName: 'Sub Power Up',
        effects: effects,
      };

      this.displayStat(subPUObj);
    }

    if ('Shield' == subName) {
      // case 5: Shield
      const calculatedData = this.getHML(subStats['param'], 'mMaxHp');
      const result = this.calculateAbilityEffect(
        skillObj.main,
        skillObj.subs,
        calculatedData[0],
        calculatedData[1],
        calculatedData[2]
      );

      const subPUEffect: Effect = {
        name: 'Max HP',
        value: Math.floor(result[0] * 1) / 10.0,
        percent: parseFloat((result[1] * 100).toFixed(2)),
      };
      effects.push(subPUEffect);

      const subPUObj: Stats = {
        name: 'BombDistance_Up',
        displayName: 'Sub Power Up',
        effects: effects,
      };

      this.displayStat(subPUObj);
    }

    if ('Flag' == subName) {
      // case 6: Flag
      const flagStats = this.leanDataService.skills!['JumpTime_Save'];

      const multiplier = this.getHML(
        subStats['param'],
        'mSubRt_Effect_ActualCnt'
      );
      const calculatedData = [
        this.getHML(flagStats, 'DokanWarp_TameFrm'),
        this.getHML(flagStats, 'DokanWarp_MoveFrm'),
      ];

      const totalAPs = this.getAPs(skillObj.main, skillObj.subs);
      const slope =
        ((multiplier[1] - multiplier[2]) / multiplier[0] -
          17.8 / multiplier[0]) /
        ((17.8 / multiplier[0]) * (17.8 / multiplier[0] + -1.0));
      const percentage =
        (totalAPs / multiplier[0]) *
        ((totalAPs / multiplier[0]) * slope + (1.0 - slope));
      const newAP = Math.floor(
        multiplier[2] + (multiplier[0] - multiplier[2]) * percentage
      );
      const newMainSubAPs = this.getMainSubPoints(newAP);

      for (let c = 0; c < 2; c++) {
        const result = this.calculateAbilityEffect(
          newMainSubAPs[0],
          newMainSubAPs[1],
          calculatedData[c][0],
          calculatedData[c][1],
          calculatedData[c][2]
        );

        let effectName;
        if (c == 0) effectName = 'Prepare Frames';
        else effectName = 'Jump Frames';

        const subPUEffect: Effect = {
          name: effectName,
          value: Math.ceil(result[0]),
          percent: parseFloat((result[1] * 100).toFixed(2)),
        };
        effects.push(subPUEffect);
      }

      const subPUObj: Stats = {
        name: 'BombDistance_Up',
        displayName: 'Sub Power Up',
        effects: effects,
      };

      this.displayStat(subPUObj);
    }
  }

  calcSpu(skillObj: Skill) {
    const weapon = this.leanDataService.currentWeapon!;
    let effects: Effect[] = [];

    // get special data
    const specialName = weapon[0].Special;
    const specialData = this.leanDataService.specials![specialName];

    // prep special values
    if (specialData['Name'] === 'SuperLanding') {
      specialData['param']['mBurst_Landing_AddHeight'] = 0.0;
      specialData['param']['mBurst_Landing_AddHeight_SJ'] = 0.0;
    }

    if (
      specialData['Name'] == 'SuperBubble' ||
      specialData['Name'] == 'Jetpack'
    ) {
      specialData['param']['mBombCoreRadiusRate'] = 1.0;
    }

    const keys: object = {
      mBurst_PaintR: 'Paint Radius',
      mTargetInCircleRadius: 'Circle Radius',
      mEnergyAbsorbFrm: 'Armor Wind Up Time',
      mPaintGauge_SpecialFrm: 'Special Duration Time',
      mBurst_SplashPaintR: 'Splash Paint Radius',
      mBurst_SplashVelL: 'Splash Velocity L',
      mBurst_SplashVelH: 'Splash Velocity H',
      mBurst_Landing_AddHeight: 'Additional High',
      mBurst_Landing_AddHeight_SJ: 'Additional High (Super Jump)',
      mRainAreaFrame: 'Rain Duration',
      mBurst_Radius_Far: 'Explosion Radius (Far)',
      mBurst_Radius_Middle: 'Explosion Radius (Middle)',
      mBurst_Radius_Near: 'Explosion Radius (Near)',
      mHP: 'HP',
      mBombCoreRadiusRate: 'Core Radius Rate',
      mCollisionPlayerRadiusMax: 'Explosion Effect Radius',
      mChargeRtAutoIncr: 'Booyah Charge Speed',
    };

    const frameKeys = [
      'mRainAreaFrame',
      'mEnergyAbsorbFrm',
      'mPaintGauge_SpecialFrm',
    ];

    // calc if current property from 'key' var exists in specialData
    Object.entries(keys).forEach(([name, translation]) => {
      if (
        name in specialData['param'] ||
        name + '_Low' in specialData['param']
      ) {
        if (
          name + 'H' in specialData['param'] ||
          name + 'High' in specialData['param'] ||
          name + '_High' in specialData['param']
        ) {
          const specialPUHML = this.getHML(specialData['param'], name);
          const specialPUVal = this.calculateAbilityEffect(
            skillObj.main,
            skillObj.subs,
            specialPUHML[0],
            specialPUHML[1],
            specialPUHML[2]
          );

          let eff = 0;
          if (name == 'mHP') {
            eff = Math.floor(specialPUVal[0] * 1) / 10;
          } else if (frameKeys.includes(name)) {
            eff = Math.ceil(specialPUVal[0] * 1);
          } else {
            eff = parseFloat((specialPUVal[0] * 1).toFixed(5));
          }

          const specialEffect = {
            name: translation,
            value: eff,
            percent: parseFloat((specialPUVal[1] * 100).toFixed(2)),
          };
          effects.push(specialEffect);
        }
      }
    });

    const specialPUObj: Stats = {
      name: 'SpecialTime_Up',
      displayName: 'Special Power Up',
      effects: effects,
    };

    this.displayStat(specialPUObj);
  }

  calcQrs(skillObj: Skill) {
    const qrsStats = this.leanDataService.skills![skillObj.skillName];

    const aroudHML = this.getHML(qrsStats, 'Dying_AroudFrm');
    const chaseHML = this.getHML(qrsStats, 'Dying_ChaseFrm');

    const aroudVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      aroudHML[0],
      aroudHML[1],
      aroudHML[2]
    );
    const chaseVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      chaseHML[0],
      chaseHML[1],
      chaseHML[2]
    );

    const respawnObj: Stats = {
      name: 'RespawnTime_Save',
      displayName: 'Quick Respawn',
      effects: [
        {
          name: 'Dying Frames',
          value: Math.ceil(chaseVal[0]),
          percent: parseFloat((chaseVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Dying Seconds',
          value: parseFloat((Math.ceil(chaseVal[0]) / 60).toFixed(2)),
          percent: parseFloat((chaseVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Deathcam Frames',
          value: Math.ceil(aroudVal[0]),
          percent: parseFloat((aroudVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Deathcam Seconds',
          value: parseFloat((Math.ceil(aroudVal[0]) / 60).toFixed(2)),
          percent: parseFloat((aroudVal[1] * 100).toFixed(2)),
        },
      ],
    };

    this.displayStat(respawnObj);
  }

  calcQsj(skillObj: Skill) {
    const qsjStats = this.leanDataService.skills![skillObj.skillName];

    const prepareHML = this.getHML(qsjStats, 'DokanWarp_TameFrm');
    const superJumpHML = this.getHML(qsjStats, 'DokanWarp_MoveFrm');

    const prepareVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      prepareHML[0],
      prepareHML[1],
      prepareHML[2]
    );
    const superJumpVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      superJumpHML[0],
      superJumpHML[1],
      superJumpHML[2]
    );

    const superJumpObj: Stats = {
      name: 'JumpTime_Save',
      displayName: 'Quick Super Jump',
      effects: [
        {
          name: 'Prepare Frames',
          value: Math.ceil(prepareVal[0]),
          percent: parseFloat((prepareVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Prepare Seconds',
          value: parseFloat((Math.ceil(prepareVal[0]) / 60).toFixed(2)),
          percent: parseFloat((prepareVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Super Jump Frames',
          value: Math.ceil(superJumpVal[0]),
          percent: parseFloat((superJumpVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Super Jump Seconds',
          value: parseFloat((Math.ceil(superJumpVal[0]) / 60).toFixed(2)),
          percent: parseFloat((superJumpVal[1] * 100).toFixed(2)),
        },
      ],
    };

    this.displayStat(superJumpObj);
  }

  calcInkRu(skillObj: Skill) {
    const inkResStats = this.leanDataService.skills![skillObj.skillName];

    const jumpHML = this.getHML(inkResStats, 'OpInk_JumpGnd');
    const velShotHML = this.getHML(inkResStats, 'OpInk_VelGnd_Shot');
    const velHML = this.getHML(inkResStats, 'OpInk_VelGnd');
    const damageLimitHML = this.getHML(inkResStats, 'OpInk_Damage_Lmt');
    const damageHML = this.getHML(inkResStats, 'OpInk_Damage');
    const armorHML = this.getHML(inkResStats, 'OpInk_Armor_HP');

    const jumpVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      jumpHML[0],
      jumpHML[1],
      jumpHML[2]
    );
    const velShotVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      velShotHML[0],
      velShotHML[1],
      velShotHML[2]
    );
    const velVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      velHML[0],
      velHML[1],
      velHML[2]
    );
    const damageLimitVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      damageLimitHML[0],
      damageLimitHML[1],
      damageLimitHML[2]
    );
    const damageVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      damageHML[0],
      damageHML[1],
      damageHML[2]
    );
    const armorVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      armorHML[0],
      armorHML[1],
      armorHML[2]
    );

    const inkResObj: Stats = {
      name: 'OpInkEffect_Reduction',
      displayName: 'Ink Resistance Up',
      effects: [
        {
          name: 'Jump in Ink',
          value: parseFloat(jumpVal[0].toFixed(4)),
          percent: parseFloat((jumpVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Shoot in Ink',
          value: parseFloat(velShotVal[0].toFixed(4)),
          percent: parseFloat((velShotVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Run Speed in Ink',
          value: parseFloat(velVal[0].toFixed(4)),
          percent: parseFloat((velVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Damage Limit in Ink',
          value: parseFloat(damageLimitVal[0].toFixed(4)),
          percent: parseFloat((damageLimitVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Damage per Frame in Ink',
          value: parseFloat(damageVal[0].toFixed(4)),
          percent: parseFloat((damageVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Armor in Ink',
          value: Math.ceil(armorVal[0]),
          percent: parseFloat((armorVal[1] * 100).toFixed(2)),
        },
      ],
    };

    this.displayStat(inkResObj);
  }

  calcBdu(skillObj: Skill) {
    // calc bomb defense up values
    const bduStats = this.leanDataService.skills![skillObj.skillName];

    const specialDamageHML = this.getHML(bduStats, 'BurstDamageRt_Special');
    const subNearHML = this.getHML(bduStats, 'BurstDamageRt_SubH');
    const subFarHML = this.getHML(bduStats, 'BurstDamageRt_SubL');

    const specialDamageVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      specialDamageHML[0],
      specialDamageHML[1],
      specialDamageHML[2]
    );
    const subNearVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      subNearHML[0],
      subNearHML[1],
      subNearHML[2]
    );
    const subFarVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      subFarHML[0],
      subFarHML[1],
      subFarHML[2]
    );

    // calc cold-blooded values
    const cbStats = this.leanDataService.skills!['MarkingTime_Reduction'];

    const pointSensorHML = this.getHML(cbStats, 'MarkingTime_ShortRt');
    const inkMineHML = this.getHML(cbStats, 'MarkingTime_ShortRt_Trap');
    const silFarHML = this.getHML(cbStats, 'Silhouette_DistFar');
    const silNearHML = this.getHML(cbStats, 'Silhouette_DistNear');

    const pointSensorVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      pointSensorHML[0],
      pointSensorHML[1],
      pointSensorHML[2]
    );
    const inkMineVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      inkMineHML[0],
      inkMineHML[1],
      inkMineHML[2]
    );
    const silFarVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      silFarHML[0],
      silFarHML[1],
      silFarHML[2]
    );
    const silNearVal = this.calculateAbilityEffect(
      skillObj.main,
      skillObj.subs,
      silNearHML[0],
      silNearHML[1],
      silNearHML[2]
    );

    const bombDefenseObj: Stats = {
      name: 'BombDamage_Reduction',
      displayName: 'Bomb Defense Up DX',
      effects: [
        {
          name: 'Special Damage Multiplier',
          value: parseFloat(specialDamageVal[0].toFixed(4)),
          percent: parseFloat((specialDamageVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Close Hit Sub Damage Multiplier',
          value: parseFloat(subNearVal[0].toFixed(4)),
          percent: parseFloat((subNearVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Far Hit Sub Damage Multiplier',
          value: parseFloat(subFarVal[0].toFixed(4)),
          percent: parseFloat((subFarVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Marking Time - Point Sensors',
          value: parseFloat(pointSensorVal[0].toFixed(4)),
          percent: parseFloat((pointSensorVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Marking Time - Ink Mines',
          value: parseFloat(inkMineVal[0].toFixed(4)),
          percent: parseFloat((inkMineVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Thermal-Ink Sillhoute - Far Range Distance',
          value: parseFloat(silFarVal[0].toFixed(4)),
          percent: parseFloat((silFarVal[1] * 100).toFixed(2)),
        },
        {
          name: 'Thermal-Ink Sillhoute - Close Range Distance',
          value: parseFloat(silNearVal[0].toFixed(4)),
          percent: parseFloat((silNearVal[1] * 100).toFixed(2)),
        },
      ],
    };

    this.displayStat(bombDefenseObj);
  }

  // get high, mid, and low values
  getHML(data: any, key: string) {
    let high = 0;
    let mid = 0;
    let low = 0;

    if (key + '_High' in data) {
      high = data[key + '_High'];
      mid = data[key + '_Mid'];
      low = data[key + '_Low'] || data[key] || 0.0;
    } else if (key + 'High' in data) {
      high = data[key + 'High'];
      mid = data[key + 'Mid'];
      low = data[key + 'Low'] || data[key] || 1.0;
    } else {
      high = data[key + 'H'];
      mid = data[key + 'M'];
      low = data[key + 'L'] || data[key] || 1.0;
    }

    return [high, mid, low];
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

    return [result, lerpN];
  }

  // main, sub to AP points
  getAPs(numOfMains: number, numOfSubs: number) {
    return 10 * numOfMains + 3 * numOfSubs;
  }

  // percent difference
  getPercentage(AP: number) {
    return Math.min(3.3 * AP - 0.027 * Math.pow(AP, 2), 100);
  }

  // slope
  getSlope(high: number, mid: number, low: number) {
    if (mid === low) return 0;

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
    } else {
      // slope != 0.5
      return Math.pow(
        Math.E,
        -1 * ((Math.log(percentage) * Math.log(slope)) / Math.log(2))
      );
    }
  }

  // result
  getResult(high: number, low: number, lerpN: number) {
    return low + (high - low) * lerpN;
  }

  getHML_MWPUG(data: any, key: string) {
    var high = 0;
    var mid = 0;
    var low = 0;

    if (
      data[key + '_MWPUG_High'] === 0 ||
      data[key + '_MWPUG_High'] === 0.0 ||
      data['Stand_' + key + '_MWPUG_High'] === 0 ||
      data['Jump_' + key + '_MWPUG_High'] === 0 ||
      data['Stand_' + key + '_MWPUG_High'] === 0.0 ||
      data['Jump_' + key + '_MWPUG_High'] === 0.0
    ) {
      high = 0.0;
    } else {
      high =
        data[key + '_MWPUG_High'] ||
        data['Stand_' + key + '_MWPUG_High'] ||
        data['Jump_' + key + '_MWPUG_High'];
    }

    if (
      data[key + '_MWPUG_Mid'] === 0 ||
      data[key + '_MWPUG_Mid'] === 0.0 ||
      data['Stand_' + key + '_MWPUG_Mid'] === 0 ||
      data['Jump_' + key + '_MWPUG_Mid'] === 0 ||
      data['Stand_' + key + '_MWPUG_Mid'] === 0.0 ||
      data['Jump_' + key + '_MWPUG_Mid'] === 0.0
    ) {
      mid = 0.0;
    } else {
      mid =
        data[key + '_MWPUG_Mid'] ||
        data['Stand_' + key + '_MWPUG_Mid'] ||
        data['Jump_' + key + '_MWPUG_Mid'];
    }

    if (
      data[key] === 0 ||
      data[key] === 0.0 ||
      data['Stand_' + key] === 0 ||
      data['Jump_' + key] === 0 ||
      data['Stand_' + key] === 0.0 ||
      data['Jump_' + key] === 0.0
    ) {
      low = 0.0;
    } else {
      low = data[key] || data['Stand_' + key] || data['Jump_' + key] || 1.0;
    }

    return [high, mid, low];
  }

  // convert AP to main and sub points
  getMainSubPoints(ap: number) {
    var main = 0;
    var sub = 0;

    while (ap >= 10) {
      main++;
      ap -= 10;
    }

    sub = ap / 3;

    return [main, sub];
  }

  displayStat(stats: object) {
    console.log(stats);
  }
}
