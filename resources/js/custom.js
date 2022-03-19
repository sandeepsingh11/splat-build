// ==================== HANDLE DRAG AND DROP ==================== //


// global vars
var version = '550';
var storageUrl = '/storage/' + version + '/';
var source = '';
var draggedSkillName = '';
var draggedSkillId = -1;
var draggedSkillType = '';
let allWeaponData = [];
let allSubData = [];
let allSpecialData = [];
let currentWeapon;
let currentSub;
let currentSpecial;
let allSkillData = [];
var gear = false;
var gearset = false;



// set mode
var uri = window.location.pathname.split('/');
if ( (uri[uri.length - 2] == 'gears') || (uri[uri.length - 3] == 'gears') ) gear = true;
else if( (uri[uri.length - 2] == 'gearsets') || (uri[uri.length - 3] == 'gearsets') ) gearset = true;



// load inital data
window.addEventListener('load', function() {
    loadData();
 });

function loadData() {
    loadWeapons();
    loadSubsAndSpecials();
    loadSkills();

    // if editing, calc existing skills
    setTimeout(() => {
        recalculateStats();
    }, 2500);
}

function loadWeapons() {
    $.getJSON(storageUrl + 'parsed-weapons.json', (weaponsData) => {
        allWeaponData = weaponsData;

        // set default weapon
        setCurrentWeapon('Shooter_BlasterLight_00');
    });
}

function setCurrentWeapon(weaponName) {
    const weaponGroupName = getWeaponGroupName(weaponName);

    const weaponData = allWeaponData[weaponGroupName][weaponName];
    const params = allWeaponData[weaponGroupName]['param'];

    let weapon = [weaponData, params];

    if (weaponGroupName.includes("Spinner") || weaponGroupName.includes("Twins")) {
        weapon.push(allWeaponData[weaponGroupName][weaponGroupName + '_2']);
    }
    else if (weaponGroupName.includes('Blaster')) {
        weapon.push(allWeaponData[weaponGroupName][weaponGroupName + '_burst']);
    }
    else if (weaponGroupName.includes('Roller')) {
        weapon.push(allWeaponData[weaponGroupName][weaponGroupName + '_stand']);
        weapon.push(allWeaponData[weaponGroupName][weaponGroupName + '_jump']);
    }

    currentWeapon = weapon;
}

function getWeaponGroupName(weaponName) {
    const weaponNameSplitted = weaponName.split('_');
    let weaponGroupName = weaponNameSplitted[0] + weaponNameSplitted[1];

    if (weaponGroupName.includes("Blaster")) {
        weaponGroupName = weaponGroupName.substring(7);
    }

    return weaponGroupName;
}

function loadSubsAndSpecials() {
    $.getJSON(storageUrl + 'parsed-subs-specials.json', (subsSpecialsData) => {
        allSubData = subsSpecialsData['subs'];
        allSpecialData = subsSpecialsData['specials'];

        // set default sub
        setCurrentSub('Bomb_Curling');

        // set default special
        setCurrentSpecial('SuperLanding');
    });
}

function setCurrentSub(subName) {
    currentSub = allSubData[subName];
}

function setCurrentSpecial(specialName) {
    currentSpecial = allSpecialData[specialName];
}

function loadSkills() {
    $.getJSON(storageUrl + 'parsed-skills.json', (skillsData) => {
        allSkillData = skillsData;
    });
}




// click-slot-to-toggle skill
const slots = document.getElementsByClassName('slot');
const bank = document.getElementsByClassName('bank');

// add skill
for (let i = 0; i < bank.length; i++) {
    bank[i].addEventListener('click', (e) => {
        clickToAddSkill(e);
    });
}

// remove skill
for (let i = 0; i < slots.length; i++) {
    slots[i].addEventListener('click', (e) => {
        clickToRemoveSkill(e)
    });
}

function clickToAddSkill(e) {
    draggedSkillName = e.target.dataset.skillName;
    draggedSkillId = e.target.dataset.skillId;
    draggedSkillType = e.target.dataset.skillType;
    draggedSkillImgUrl = e.target.src;

    // find next open slot
    let openSlotEle = null;
    for (let j = 0; j < slots.length; j++) {
        if (slots[j].dataset.skillId === '27') {
            openSlotEle = slots[j];
            break;
        }
    }

    // continue if there is an available slot (currently 'unknown' skill)
    if (openSlotEle != null) {
        // skill types of 'Main' must be dropped in the 'Main' skill slot
        if (draggedSkillType === 'Main') {
            
            if (openSlotEle.parentNode.id !== 'skill-main') {

                // illegal drop
                return;
            }
        }

        // update slot's values
        openSlotEle.src = draggedSkillImgUrl;
        openSlotEle.alt = draggedSkillName;
        openSlotEle.dataset.skillId = draggedSkillId;
        openSlotEle.dataset.skillName = draggedSkillName;


        // set the slot's id to the hidden input field
        document.getElementById('hidden-' + openSlotEle.parentNode.id).value = draggedSkillId;
        
        
        // calc stats
        var highMidLowFiles = [
            'BombDamage_Reduction',
            'BombDistance_Up',
            'HumanMove_Up',
            'InkRecovery_Up',
            'JumpTime_Save',
            'MainInk_Save',
            'MarkingTime_Reduction',
            'OpInkEffect_Reduction',
            'RespawnSpecialGauge_Save',
            'RespawnTime_Save',
            'SpecialIncrease_Up',
            'SpecialTime_Up',
            'SquidMove_Up',
            'SubInk_Save'
        ];

        if (highMidLowFiles.indexOf(draggedSkillName) != -1) {    
            // recalculateStats();
        }
    }
}

function clickToRemoveSkill(e) {
    if (e.target.dataset.skillId != '27') {
        // reset slot's values
        e.target.src = '/storage/skills/Unknown.png';
        e.target.alt = 'unknown';
        e.target.dataset.skillId = '27';
        e.target.dataset.skillName = 'Unknown';

        // reset the slot's id to the hidden input field
        document.getElementById('hidden-' + e.target.parentNode.id).value = '27';

        // re-calc
        // recalculateStats();
    }
}




// on dragstart handler
function dragStartHandler(e) {
    e.dataTransfer.effectAllowed = "copyMove";
    
    
    // set draggable info
    e.dataTransfer.setData("text/uri-list", e.target.src);
    e.dataTransfer.setData("text/plain", e.target.src);
    draggedSkillName = e.target.dataset.skillName;
    draggedSkillId = e.target.dataset.skillId;
    draggedSkillType = e.target.dataset.skillType;
    source = e.target.parentElement.dataset.source;
}



// on dragover handler
function dragOverHandler(e) {
    e.preventDefault();
    
    // if (source == 'bank') {
    //     e.dataTransfer.dropEffect = "copy";
    // }
    // else if (source == 'slot') {
    //     e.dataTransfer.dropEffect = "move";
    // }
}



// on drop handler
function dropHandler(e) {
    e.preventDefault();

    
    // skill types of 'Main' must be dropped in the 'Main' skill slot
    if (draggedSkillType === 'Main') {
        
        if (e.target.parentNode.id !== 'skill-main') {

            // illegal drop
            return;
        }
    }

    // get dropped image url
    var droppedImageUrl = e.dataTransfer.getData("text/plain");
        
        
    // update newly dropped image values
    e.target.src = droppedImageUrl;
    e.target.alt = draggedSkillName;
    e.target.dataset.skillId = draggedSkillId;
    e.target.dataset.skillName = draggedSkillName;


    // set the dropped skill's id to the hidden input field
    document.getElementById('hidden-' + e.target.parentNode.id).value = draggedSkillId;
    
    

    var highMidLowFiles = [
        'BombDamage_Reduction',
        'BombDistance_Up',
        'HumanMove_Up',
        'InkRecovery_Up',
        'JumpTime_Save',
        'MainInk_Save',
        'MarkingTime_Reduction',
        'OpInkEffect_Reduction',
        'RespawnSpecialGauge_Save',
        'RespawnTime_Save',
        'SpecialIncrease_Up',
        'SpecialTime_Up',
        'SquidMove_Up',
        'SubInk_Save'
    ];

    if (highMidLowFiles.indexOf(draggedSkillName) != -1) {    
        // recalculateStats();
    }
}





function recalculateStats() {
    // clear stats display
    const containerEle = $('#stats');
    containerEle.empty();

    // set current weapon, sub, and special
    const currentWeapon = document.getElementById('selected-weapon-name');
    setCurrentWeapon(currentWeapon.value);
    const currentSub = document.getElementById('sub-img');
    setCurrentSub(currentSub.dataset.subName);
    const currentSpecial = document.getElementById('special-img');
    setCurrentSpecial(currentSpecial.dataset.specialName);

    // get all inputted skill names
    const inputtedSkillNames = getInputtedSkillNames();

    // map number of main and subs to each inputted skill
    const mainAndSubs = getMainAndSubs(inputtedSkillNames);

    // calculate ability effect for each inputted skill
    mainAndSubs.forEach(skillObj => {

        switch (skillObj.skillName) {
            case 'MainInk_Save':
                calcIsm(skillObj);
                break;
            case 'SubInk_Save':
                calcIss(skillObj);
                break;
            case 'InkRecovery_Up':
                calcIru(skillObj);
                break;
            case 'HumanMove_Up':
                calcRsu(skillObj);
                break;
            case 'SquidMove_Up':
                calcSsu(skillObj);
                break;
            case 'SpecialIncrease_Up':
                calcScu(skillObj);
                break;
            case 'RespawnSpecialGauge_Save':
                calcSs(skillObj);
                break;
            case 'MarkingTime_Reduction':
                calcMpu(skillObj);
                break;
            case 'BombDistance_Up':
                calcSubPu(skillObj);
                break;
            case 'SpecialTime_Up':
                calcSpu(skillObj);
                break;
            case 'RespawnTime_Save':
                calcQrs(skillObj);
                break;
            case 'JumpTime_Save':
                calcQsj(skillObj);
                break;
            case 'OpInkEffect_Reduction':
                calcInkRu(skillObj);
                break;
            case 'BombDamage_Reduction':
                calcBdu(skillObj);
                break;
        } 
    });
}

function calcIsm(skillObj) {
    const ismStats = allSkillData[skillObj.skillName];
    const weapon = currentWeapon;
    const weaponName = weapon[0]["Name"];


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
    const consumeRateHML = getHML(ismStats, key);
    const consumeRateVal = calculateAbilityEffect(skillObj.main, skillObj.subs, consumeRateHML[0], consumeRateHML[1], consumeRateHML[2]);

    const inkTankSize = weapon[1].mInkMagazineRatio || 1.0;


    const mainInkSaveObj = {
        name: 'MainInk_Save',
        displayName: 'Ink Saver - Main',
        effects: [
            {
                name: 'Ink Consumption / Shot',
                value: (consumeRateVal[0] * inkConsume).toFixed(5),
                percent: (consumeRateVal[1] * 100).toFixed(2)
            },
            {
                name: 'Max Number of Shots',
                value: Math.floor(inkTankSize / (consumeRateVal[0] * inkConsume)),
                percent: (consumeRateVal[1] * 100).toFixed(2)
            }
        ]
    }

    displayStat(mainInkSaveObj);
}

function calcIss(skillObj) {
    const issStats = allSkillData[skillObj.skillName];

    // prep sub info
    const subData = currentSub;
    const inkConsume = subData['param'].mInkConsume;
    let key;

    if ('ConsumeRt_Sub_A_Low' in issStats) {
        key = "ConsumeRt_Sub_" + subData.InkSaverType;
    }
    else {
        if (subData.InkSaverLv == "Middle") {
            key = "ConsumeRt_Sub";
        }
        else {
            key = "ConsumeRt_Sub_" + subData.InkSaverLv;
        }
    }

    const consumeRateHML = getHML(issStats, key);
    const consumeRateVal = calculateAbilityEffect(skillObj.main, skillObj.subs, consumeRateHML[0], consumeRateHML[1], consumeRateHML[2]);


    const subInkSaveObj = {
        name: 'SubInk_Save',
        displayName: 'Ink Saver - Sub',
        effects: [
            {
                name: 'Ink Consumption',
                value: (consumeRateVal[0] * inkConsume).toFixed(5),
                percent: (consumeRateVal[1] * 100).toFixed(2)
            }
        ]
    }

    displayStat(subInkSaveObj);
}

function calcIru(skillObj) {
    const iruStats = allSkillData[skillObj.skillName];

    const squidFormHML = getHML(iruStats, 'RecoverFullFrm_Ink');
    const humanFormHML = getHML(iruStats, 'RecoverNrmlFrm_Ink');

    const squidFormVal = calculateAbilityEffect(skillObj.main, skillObj.subs, squidFormHML[0], squidFormHML[1], squidFormHML[2]);
    const humanFormVal = calculateAbilityEffect(skillObj.main, skillObj.subs, humanFormHML[0], humanFormHML[1], humanFormHML[2]);

    const inkRecoveryObj = {
        name: 'InkRecovery_Up',
        displayName: 'Ink Recovery Up',
        effects: [
            {
                name: 'Recovery Time in Ink - Frames',
                value: Math.ceil(squidFormVal[0]),
                percent: (squidFormVal[1] * 100).toFixed(2)
            },
            {
                name: 'Recovery Time in Ink - Seconds',
                value: (Math.ceil(squidFormVal[0]) / 60).toFixed(2),
                percent: (squidFormVal[1] * 100).toFixed(2)
            },
            {
                name: 'Recovery Time Standing - Frames',
                value: Math.ceil(humanFormVal[0]),
                percent: (humanFormVal[1] * 100).toFixed(2)
            },
            {
                name: 'Recovery Time Standing - Seconds',
                value: (Math.ceil(humanFormVal[0]) / 60).toFixed(2),
                percent: (humanFormVal[1] * 100).toFixed(2)
            }
        ]
    }

    displayStat(inkRecoveryObj);
}

function calcRsu(skillObj) {
    const rsuStats = allSkillData[skillObj.skillName];
    const weapon = currentWeapon;
    const baseSpeed = [1, weapon[1]["mMoveSpeed"]];
    let calculatedData;
    let effects = [];

    
    if (weapon[0]["MoveVelLv"] == "Low") {
        calculatedData = getHML(rsuStats, "MoveVel_Human_BigWeapon");
    } 
    else if (weapon[0]["MoveVelLv"] == "High") {
        calculatedData = getHML(rsuStats, "MoveVel_Human_ShortWeapon");
    } 
    else {
        calculatedData = getHML(rsuStats, "MoveVel_Human");
    }

    const calculatedDataWeapon = getHML(rsuStats, "MoveVelRt_Human_Shot" + (weapon[0]["ShotMoveVelType"] || ""));


    // run speed
    const runSpeedVal = calculateAbilityEffect(skillObj.main, skillObj.subs, calculatedData[0], calculatedData[1], calculatedData[2]);
    const runSpeedEffect = {
        name: 'Run Speed (DU/Frame)',
        value: (runSpeedVal[0] * baseSpeed[0]).toFixed(5),
        percent: (runSpeedVal[1] * 100).toFixed(2)
    }
    effects.push(runSpeedEffect);


    // run speed shooting
    const runSpeedShootingVal = calculateAbilityEffect(skillObj.main, skillObj.subs, calculatedDataWeapon[0], calculatedDataWeapon[1], calculatedDataWeapon[2]);
    const runSpeedEffectShooting = {
        name: 'Run Speed (Shooting) (DU/Frame)',
        value: (runSpeedShootingVal[0] * baseSpeed[1]).toFixed(5),
        percent: (runSpeedShootingVal[1] * 100).toFixed(2)
    }
    effects.push(runSpeedEffectShooting);


    const runSpeedObj = {
        name: 'HumanMove_Up',
        displayName: 'Run Speed Up',
        effects: effects
    }

    displayStat(runSpeedObj);
}

function calcSsu(skillObj) {
    const ssuStats = allSkillData[skillObj.skillName];
    const weapon = currentWeapon;
    let calculatedData;
    let effects = [];


    if (weapon[0]["MoveVelLv"] == "Low") {
        calculatedData = getHML(ssuStats, "MoveVel_Stealth_BigWeapon");
    } 
    else if (weapon[0]["MoveVelLv"] == "High") {
        calculatedData = getHML(ssuStats, "MoveVel_Stealth_ShortWeapon");
    } 
    else {
        calculatedData = getHML(ssuStats, "MoveVel_Stealth");
    }


    // swim speed
    const swimSpeedVal = calculateAbilityEffect(skillObj.main, skillObj.subs, calculatedData[0], calculatedData[1], calculatedData[2]);
    const swimSpeedEffect = {
        name: 'Swim Speed (DU/Frame)',
        value: (swimSpeedVal[0]).toFixed(5),
        percent: (swimSpeedVal[1] * 100).toFixed(2)
    }
    effects.push(swimSpeedEffect);


    // swim speed - ninja
    const swimSpeedNinjaVal = calculateAbilityEffect(skillObj.main, skillObj.subs, calculatedData[0], calculatedData[1], calculatedData[2], true);
    const swimSpeedEffectNinja = {
        name: 'Swim Speed (Ninja) (DU/Frame)',
        value: (swimSpeedNinjaVal[0]).toFixed(5),
        percent: (swimSpeedNinjaVal[1] * 100).toFixed(2)
    }
    effects.push(swimSpeedEffectNinja);


    const swimSpeedObj = {
        name: 'SquidMove_Up',
        displayName: 'Swim Speed Up',
        effects: effects
    }

    displayStat(swimSpeedObj);
}

function calcScu(skillObj) {
    const scuStats = allSkillData[skillObj.skillName];
    const weapon = currentWeapon;

    const chargeUpHML = getHML(scuStats, 'SpecialRt_Charge');
    const chargeUpVal = calculateAbilityEffect(skillObj.main, skillObj.subs, chargeUpHML[0], chargeUpHML[1], chargeUpHML[2]);


    const chargeUpObj = {
        name: 'SpecialIncrease_Up',
        displayName: 'Special Charge Up',
        effects: [
            {
                name: 'Special Cost',
                value: Math.ceil(weapon[0]["SpecialCost"] / chargeUpVal[0]),
                percent: (chargeUpVal[1] * 100).toFixed(2)
            }
        ]
    }

    displayStat(chargeUpObj);
}

function calcSs(skillObj) {
    const ssStats = allSkillData[skillObj.skillName];
    const weapon = currentWeapon;

    const specialSaveHML = getHML(ssStats, "SpecialRt_Restart");
    const specialSaveVal = calculateAbilityEffect(skillObj.main, skillObj.subs, specialSaveHML[0], specialSaveHML[1], specialSaveHML[2]);

    const specialSaveObj = {
        name: 'RespawnSpecialGauge_Save',
        displayName: 'Special Saver',
        effects: [
            {
                name: 'Special Remaining',
                value: Math.ceil(weapon[0]["SpecialCost"] * specialSaveVal[0]),
                percent: (specialSaveVal[1] * 100).toFixed(2)
            },
            {
                name: 'Percentage Remaining',
                value: (100 * specialSaveVal[0]).toFixed(4),
                percent: (specialSaveVal[1] * 100).toFixed(2)
            }
        ]
    }

    displayStat(specialSaveObj);
}

function calcMpu(skillObj) {
    const weapon = currentWeapon;
    let effects = [];

    const keys = {
        'mBulletDamageMaxDist': 'Bullet Damage Max Distance',
        'mBulletDamageMinDist': 'Bullet Damage Min Distance',
        'mCanopyHP': 'Canopy HP',
        'mCanopyNakedFrame': 'Canopy Recovery Time',
        'mCollisionRadiusFarRate': 'Collision Radius Far',
        'mCollisionRadiusMiddleRate': 'Collision Radius Middle',
        'mCollisionRadiusNearRate': 'Collision Radius Near',
        'mCoreDamageRate': 'Core Damage Rate',
        'mCorePaintWidthHalfRate': 'Core Paint Width Half Rate',
        'mDamageMaxMaxChargeRate': 'Damage Max Charge Rate',
        'mDamageRate': 'Damage',
        'mDashSpeed': 'Dash Speed',
        'mDegBias': 'Degree Bias',
        'mDegJumpBiasInterpolateRate': 'Jump Bias Interpolation Rate',
        'mDegJumpBias': 'Degree Jump Bias',
        'mDegJumpRandom': 'Degree Jump Random',
        'mDegRandom': 'Degree Random',
        'mDropSplashPaintRadiusRate': 'Drop Splash Paint Radius Rate',
        'mFirstGroupBulletBoundPaintRadiusRate': 'Group 1 Bullet Paint Radius Rate (Outer)',
        'mFirstGroupBulletDamageRate': 'Group 1 Bullet Damage Rate',
        'mFirstGroupBulletFirstPaintRRate': 'Group 1 Bullet Paint Radius Rate',
        'mFirstGroupBurst_PaintRRate': 'Group 1 Bullet PaintR Rate',
        'mFirstGroupSplashPaintRadiusRate': 'Group 1 Bullet Splash Paint Radius Rate',
        'mFirstSecondMaxChargeShootingFrameTimes': 'Splatling Max Charge Frame',
        'mFullChargeDamageRate': 'Full Charge Damage',
        'mFullChargeDistance': 'Full Charge Distance',
        'mInitVelRate': 'Init Velocity Rate',
        'mInkConsumeCoreMaxSpeed': 'Ink Consume Max Speed',
        'mInkConsumeCoreMinSpeed': 'Ink Consume Min Speed',
        'mKnockBackRadiusRate': 'Knock Back Radius',
        'mMaxDistance': 'Max Distance',
        'mMinMaxChargeDamageRate': 'Max Shooting Damage',
        'mMoveSpeed': 'Move Speed',
        'mSecondGroupBulletBoundPaintRadiusRate': 'Group 2 Bullet Paint Radius Rate (Outer)',
        'mSecondGroupBulletDamageRate': 'Group 2 Bullet Damage Rate',
        'mSecondGroupBulletFirstPaintRRate': 'Group 2 Bullet Paint Radius Rate',
        'mSecondGroupBurst_PaintRRate': 'Group 2 Bullet PaintR Rate',
        'mSecondGroupSplashPaintRadiusRate': 'Group 2 Bullet Splash Paint Radius Rate',
        'mSideStepOneMuzzleDamageRate': 'Side Step One Muzzle Damage',
        'mSphereSplashDropPaintRadiusRate': 'Sphere Splash Drop Paint Radius',
        'mSplashDamageInsideRate': 'Splash Damage Inside Rate',
        'mSplashDamageOutsideRate': 'Splash Damage Outside Rate',
        'mSplashPaintRadiusRate': 'Paint Radius Rate',
        'mSplashPaintRadius': 'Paint Radius',
        'mThirdGroupBulletBoundPaintRadiusRate': 'Group 3 Bullet Paint Radius Rate (Outer)',
        'mThirdGroupBulletDamageRate': 'Group 3 Bullet Damage Rate',
        'mThirdGroupBulletFirstPaintRRate': 'Group 3 Bullet Paint Radius Rate',
        'mThirdGroupBurst_PaintRRate': 'Group 3 Bullet PaintR Rate',
        'mThirdGroupSplashPaintRadiusRate': 'Group 3 Bullet Splash Paint Radius Rate'
    }
    const dmgKeys = ["mDamageRate", "mMinMaxChargeDamageRate", "mFullChargeDamageRate", "mDamageMaxMaxChargeRate", "mCoreDamageRate", "mSideStepOneMuzzleDamageRate"];
    const rates = ["mCollisionRadiusFarRate", "mCollisionRadiusMiddleRate", "mCollisionRadiusNearRate", "mKnockBackRadiusRate", "mSphereSplashDropPaintRadiusRate"];

    $.each(keys, function(name, translation) {
        if ((name + "_MWPUG_High" in weapon[1]) || 
            (weapon[2] !== undefined && name + "_MWPUG_High" in weapon[2]) || 
            (weapon[3] !== undefined && name + "_MWPUG_High" in weapon[3])
        ) {
            let mainPUHML = null;
            if (name + "_MWPUG_High" in weapon[1]) {
                mainPUHML = getHML_MWPUG(weapon[1], name);
            }
            else if (weapon[2] !== undefined && name + "_MWPUG_High" in weapon[2]) {
                mainPUHML = getHML_MWPUG(weapon[2], name);
            }
            else if (weapon[3] !== undefined && name + "_MWPUG_High" in weapon[3]) {
                mainPUHML = getHML_MWPUG(weapon[3], name);
            }            
            
            if (mainPUHML[0] != mainPUHML[1]) {
                let mainPUVal = calculateAbilityEffect(skillObj.main, skillObj.subs, mainPUHML[0], mainPUHML[1], mainPUHML[2]);
                let eff = 0;

                if (name == "mCanopyHP") {
                    eff = Math.floor(mainPUVal[0] * 1) / 10;
                } 
                else if (name == "mCanopyNakedFrame") {
                    eff = Math.ceil(mainPUVal[0] * 1);
                } 
                else if (name == "mFirstSecondMaxChargeShootingFrameTimes") {
                    let f1 = weapon[2]["mFirstPeriodMaxChargeShootingFrame"];
                    let f2 = weapon[2]["mSecondPeriodMaxChargeShootingFrame"];

                    eff = Math.ceil(mainPUVal[0] * (f1 + f2));
                } 
                else if (dmgKeys.includes(name)) {
                    let dmg = 0;
                    let dmg_max = 0;
                    
                    if (name == "mDamageRate") {
                        dmg = weapon[1]["mDamageMax"];
                        dmg_max = weapon[1]["mDamage_MWPUG_Max"];
                    }
                    if (name == "mDamageMaxMaxChargeRate") {
                        dmg = weapon[2]["mDamageMaxMaxCharge"];
                        dmg_max = weapon[2]["mDamageMaxMaxCharge_MWPUG_Max"];
                    }
                    if (name == "mMinMaxChargeDamageRate") {
                        dmg = weapon[1]["mMaxChargeDamage"];
                        dmg_max = weapon[1]["mMinMaxChargeDamage_MWPUG_Max"];
                    }
                    if (name == "mFullChargeDamageRate") {
                        dmg = weapon[1]["mFullChargeDamage"];
                        dmg_max = weapon[1]["mFullChargeDamage_MWPUG_Max"];
                    }
                    if (name == "mCoreDamageRate") {
                        dmg = weapon[1]["mCoreDamage"];
                        dmg_max = weapon[1]["mCoreDamage_MWPUG_Max"];
                    }
                    if (name == "mSideStepOneMuzzleDamageRate") {
                        dmg = weapon[2]["mSideStepOneMuzzleDamageMax"];
                        dmg_max = weapon[2]["mSideStepOneMuzzleDamage_MWPUG_Max"];
                    }

                    eff = Math.floor(mainPUVal[0] * dmg);
                    if (eff > dmg_max) {
                        eff = dmg_max;
                    }
                    eff = eff / 10;
                } 
                else if (rates.includes(name)) {
                    if (name == "mCollisionRadiusFarRate") {
                        radius = weapon[2]["mCollisionRadiusFar"];
                        radius_max = weapon[2]["mCollisionRadiusFar_MWPUG_Max"];
                    }
                    if (name == "mCollisionRadiusMiddleRate") {
                        radius = weapon[2]["mCollisionRadiusMiddle"];
                        radius_max = weapon[2]["mCollisionRadiusMiddle_MWPUG_Max"];
                    }
                    if (name == "mCollisionRadiusNearRate") {
                        radius = weapon[2]["mCollisionRadiusNear"];
                        radius_max = weapon[2]["mCollisionRadiusNear_MWPUG_Max"];
                    }
                    if(name == "mKnockBackRadiusRate") {
                        radius = weapon[2]["mKnockBackRadius"];
                        radius_max = weapon[2]["mKnockBackRadius_MWPUG_Max"];
                    }
                    if (name == "mSphereSplashDropPaintRadius") {
                        radius = weapon[2]["mSphereSplashDropPaintRadius"];
                        radius_max = 999;
                    }
                    

                    eff = (mainPUVal[0] * radius).toFixed(5);
                    if (eff > radius_max) {
                        eff = radius_max;
                    }
                
                } 
                else {
                    eff = (mainPUVal[0] * 1).toFixed(5);
                }


                const mainPUEffect = {
                    name: translation,
                    value: eff,
                    percent: (mainPUVal[1] * 100).toFixed(2)
                }
                effects.push(mainPUEffect);
            }
        }
    });


    const mainPUObj = {
        name: 'MarkingTime_Reduction',
        displayName: 'Main Power Up',
        effects: effects
    }

    displayStat(mainPUObj);
}

function calcSubPu(skillObj) {
    const weapon = currentWeapon;
    const subName = weapon[0].Sub;

    const bru = ["Bomb_Splash", "Bomb_Suction", "Bomb_Quick", "PointSensor", "PoisonFog", "Bomb_Robo", "Bomb_Tako", "Bomb_Piyo"]
    
    
    const subStats = allSubData[subName];
    let effects = [];
    if (bru.includes(subName)) {
        // case 1: bomblike object + tako + piyo + point sensors
        let calculatedData = [];
        
        if (subName == "Bomb_Piyo") {
            calculatedData = getHML(allSkillData['BombDistance_Up'], "BombThrow_VelZ_BombPiyo");
        } 
        else if (subName == "Bomb_Tako") {
            calculatedData = getHML(allSkillData['BombDistance_Up'], "BombThrow_VelZ_BombTako");
        } 
        else if (subName == "PointSensor") {
            calculatedData = getHML(allSkillData['BombDistance_Up'], "BombThrow_VelZ_PointSensor");
        } 
        else {
            calculatedData = getHML(allSkillData['BombDistance_Up'], "BombThrow_VelZ");
        }


        const result = calculateAbilityEffect(skillObj.main, skillObj.subs, calculatedData[0], calculatedData[1], calculatedData[2]);
        const subPUEffect = {
            name: 'Throw Velocity',
            value: (result[0] * 1).toFixed(5),
            percent: (result[1] * 100).toFixed(2)
        }
        effects.push(subPUEffect);


        // special case: PointSensor
        if ("PointSensor" == subName) {
            const calculatedData = getHML(subStats["param"], "mMarkingFrame");

            const result = calculateAbilityEffect(skillObj.main, skillObj.subs, calculatedData[0], calculatedData[1], calculatedData[2]);
            const subPUEffect = {
                name: 'Marking Time',
                value: Math.ceil(result[0]),
                percent: (result[1] * 100).toFixed(2)
            }
            effects.push(subPUEffect);
        }


        const subPUObj = {
            name: 'BombDistance_Up',
            displayName: 'Sub Power Up',
            effects: effects
        }

        displayStat(subPUObj);
    }

    if ("Bomb_Curling" == subName) {
        // case 2: Bomb_Curling
        const calculatedData = getHML(subStats["param"], "mInitVelAndBaseSpeed");
        const result = calculateAbilityEffect(skillObj.main, skillObj.subs, calculatedData[0], calculatedData[1], calculatedData[2]);

        const subPUEffect = {
            name: 'Base Speed',
            value: (result[0] * 1).toFixed(5),
            percent: (result[1] * 100).toFixed(2)
        }
        effects.push(subPUEffect);

        const subPUObj = {
            name: 'BombDistance_Up',
            displayName: 'Sub Power Up',
            effects: effects
        }

        displayStat(subPUObj);
    }

    if ("TimerTrap" == subName) {
        // case 3: TimerTrap
        const calculatedData = [getHML(subStats["param"], "mBombCoreRadiusRate"), getHML(subStats["param"], "mPlayerColRadius"), getHML(subStats["param"], "mMarkingFrame")];
        for (let c = 0; c < 3 ; c++) {
            const result = calculateAbilityEffect(skillObj.main, skillObj.subs, calculatedData[c][0], calculatedData[c][1], calculatedData[c][2], skillObj.skillName);

            let eff = 0;
            if (c < 2) {
                eff = (result[0] * 1).toFixed(5);
            } 
            else {
                eff = Math.ceil(result[0] * 1);
            }


            let effectName;
            if (c == 0) effectName = 'Explosion Radius Rate';
            else if (c == 1) effectName = 'Marking Radius';
            else effectName = 'Marking Duration';

            const subPUEffect = {
                name: effectName,
                value: eff,
                percent: (result[1] * 100).toFixed(2)
            }
            effects.push(subPUEffect);
        }

        const subPUObj = {
            name: 'BombDistance_Up',
            displayName: 'Sub Power Up',
            effects: effects
        }

        displayStat(subPUObj);
    }

    if ("Sprinkler" == subName) {
        // case 4: Sprinkler
        const calculatedData = [getHML(subStats["param"], "mPeriod_First"), getHML(subStats["param"], "mPeriod_Second")];
        for (let c = 0; c < 2 ; c++) {
            const result = calculateAbilityEffect(skillObj.main, skillObj.subs, calculatedData[c][0], calculatedData[c][1], calculatedData[c][2], skillObj.skillName);

            let effectName;
            if (c == 0) effectName = 'First Phase Duration';
            else effectName = 'Second Phase Duration';

            const subPUEffect = {
                name: effectName,
                value: Math.ceil(result[0] * 1),
                percent: (result[1] * 100).toFixed(2)
            }
            effects.push(subPUEffect);
        }

        const subPUObj = {
            name: 'BombDistance_Up',
            displayName: 'Sub Power Up',
            effects: effects
        }

        displayStat(subPUObj);
    }

    if ("Shield" == subName) {
        // case 5: Shield
        const calculatedData = getHML(subStats["param"], "mMaxHp");
        const result = calculateAbilityEffect(skillObj.main, skillObj.subs, calculatedData[0], calculatedData[1], calculatedData[2]);

        const subPUEffect = {
            name: 'Max HP',
            value: Math.floor(result[0] * 1) / 10.0,
            percent: (result[1] * 100).toFixed(2)
        }
        effects.push(subPUEffect);

        const subPUObj = {
            name: 'BombDistance_Up',
            displayName: 'Sub Power Up',
            effects: effects
        }

        displayStat(subPUObj);
    }

    if ("Flag" == subName) {
        // case 6: Flag
        const flagStats = allSkillData['JumpTime_Save'];

        const multiplier = getHML(subStats["param"], "mSubRt_Effect_ActualCnt");
        const calculatedData = [getHML(flagStats, "DokanWarp_TameFrm"), getHML(flagStats, "DokanWarp_MoveFrm")];

        const totalAPs = getAPs(skillObj.main, skillObj.subs);
        const slope = (((multiplier[1] - multiplier[2]) / multiplier[0]) - (17.8 / multiplier[0])) / ((17.8 / multiplier[0]) * ((17.8 / multiplier[0]) + -1.0));
        const percentage = (totalAPs / multiplier[0]) * (((totalAPs / multiplier[0]) * slope) + (1.0 - slope));
        const newAP = Math.floor(multiplier[2] + ((multiplier[0] - multiplier[2]) * percentage));
        const newMainSubAPs = getMainSubPoints(newAP);

        for (let c = 0; c < 2 ; c++) {
            const result = calculateAbilityEffect(newMainSubAPs[0], newMainSubAPs[1], calculatedData[c][0], calculatedData[c][1], calculatedData[c][2], skillObj.skillName);

            let effectName;
            if (c == 0) effectName = 'Prepare Frames';
            else effectName = 'Jump Frames';

            const subPUEffect = {
                name: effectName,
                value: Math.ceil(result[0]),
                percent: (result[1] * 100).toFixed(2)
            }
            effects.push(subPUEffect);
        }

        const subPUObj = {
            name: 'BombDistance_Up',
            displayName: 'Sub Power Up',
            effects: effects
        }

        displayStat(subPUObj);
    }
}

function calcSpu(skillObj) {
    const weapon = currentWeapon;
    let effects = [];

    // get special data
    const specialName = weapon[0].Special;
    const specialData = allSpecialData[specialName];


    // prep special values
    if (specialData["Name"] === "SuperLanding") {
        specialData['param']["mBurst_Landing_AddHeight"] = 0.0;
        specialData['param']["mBurst_Landing_AddHeight_SJ"] = 0.0;
    }

    if ((specialData["Name"] == "SuperBubble") || (specialData["Name"] == "Jetpack")) {
        specialData['param']["mBombCoreRadiusRate"] = 1.0;
    }

    const keys = {
        "mBurst_PaintR": "Paint Radius",
        "mTargetInCircleRadius": "Circle Radius",
        "mEnergyAbsorbFrm": "Armor Wind Up Time",
        "mPaintGauge_SpecialFrm": "Special Duration Time",
        "mBurst_SplashPaintR": "Splash Paint Radius",
        "mBurst_SplashVelL": "Splash Velocity L",
        "mBurst_SplashVelH": "Splash Velocity H",
        "mBurst_Landing_AddHeight": "Additional High",
        "mBurst_Landing_AddHeight_SJ": "Additional High (Super Jump)",
        "mRainAreaFrame": "Rain Duration",
        "mBurst_Radius_Far": "Explosion Radius (Far)",
        "mBurst_Radius_Middle": "Explosion Radius (Middle)",
        "mBurst_Radius_Near": "Explosion Radius (Near)",
        "mHP": "HP",
        "mBombCoreRadiusRate": "Core Radius Rate",
        "mCollisionPlayerRadiusMax": "Explosion Effect Radius",
        "mChargeRtAutoIncr": "Booyah Charge Speed"
    }

    const frameKeys = ["mRainAreaFrame", "mEnergyAbsorbFrm", "mPaintGauge_SpecialFrm"];


    // calc if current property from 'key' var exists in specialData
    $.each(keys, function(name, translation) {
        if (name in specialData['param'] || name + "_Low" in specialData['param']) {
            if (name + "H" in specialData['param'] || name + "High" in specialData['param'] || name + "_High" in specialData['param']) {
                const specialPUHML = getHML(specialData['param'], name);
                const specialPUVal = calculateAbilityEffect(skillObj.main, skillObj.subs, specialPUHML[0], specialPUHML[1], specialPUHML[2]);

                let eff = 0;
                if (name == "mHP") {
                    eff = Math.floor(specialPUVal[0] * 1) / 10;
                } 
                else if (frameKeys.includes(name)) {
                    eff = Math.ceil(specialPUVal[0] * 1);
                } 
                else {
                    eff = (specialPUVal[0] * 1).toFixed(5);
                }


                const specialEffect = {
                    name: translation,
                    value: eff,
                    percent: (specialPUVal[1] * 100).toFixed(2)
                }
                effects.push(specialEffect);
            }
        }
    });

    
    const specialPUObj = {
        name: 'SpecialTime_Up',
        displayName: 'Special Power Up',
        effects: effects
    }

    displayStat(specialPUObj);
}

function calcQrs(skillObj) {
    const qrsStats = allSkillData[skillObj.skillName];

    const aroudHML = getHML(qrsStats, 'Dying_AroudFrm');
    const chaseHML = getHML(qrsStats, 'Dying_ChaseFrm');

    const aroudVal = calculateAbilityEffect(skillObj.main, skillObj.subs, aroudHML[0], aroudHML[1], aroudHML[2]);
    const chaseVal = calculateAbilityEffect(skillObj.main, skillObj.subs, chaseHML[0], chaseHML[1], chaseHML[2]);


    const respawnObj = {
        name: 'RespawnTime_Save',
        displayName: 'Quick Respawn',
        effects: [
            {
                name: 'Dying Frames',
                value: Math.ceil(chaseVal[0]),
                percent: (chaseVal[1] * 100).toFixed(2)
            },
            {
                name: 'Dying Seconds',
                value: (Math.ceil(chaseVal[0]) / 60).toFixed(2),
                percent: (chaseVal[1] * 100).toFixed(2)
            },
            {
                name: 'Deathcam Frames',
                value: Math.ceil(aroudVal[0]),
                percent: (aroudVal[1] * 100).toFixed(2)
            },
            {
                name: 'Deathcam Seconds',
                value: (Math.ceil(aroudVal[0]) / 60).toFixed(2),
                percent: (aroudVal[1] * 100).toFixed(2)
            }
        ]
    }

    displayStat(respawnObj);
}

function calcQsj(skillObj) {
    const qsjStats = allSkillData[skillObj.skillName];

    const prepareHML = getHML(qsjStats, 'DokanWarp_TameFrm');
    const superJumpHML = getHML(qsjStats, 'DokanWarp_MoveFrm');

    const prepareVal = calculateAbilityEffect(skillObj.main, skillObj.subs, prepareHML[0], prepareHML[1], prepareHML[2]);
    const superJumpVal = calculateAbilityEffect(skillObj.main, skillObj.subs, superJumpHML[0], superJumpHML[1], superJumpHML[2]);

    
    const superJumpObj = {
        name: 'JumpTime_Save',
        displayName: 'Quick Super Jump',
        effects: [
            {
                name: 'Prepare Frames',
                value: Math.ceil(prepareVal[0]),
                percent: (prepareVal[1] * 100).toFixed(2)
            },
            {
                name: 'Prepare Seconds',
                value: (Math.ceil(prepareVal[0]) / 60).toFixed(2),
                percent: (prepareVal[1] * 100).toFixed(2)
            },
            {
                name: 'Super Jump Frames',
                value: Math.ceil(superJumpVal[0]),
                percent: (superJumpVal[1] * 100).toFixed(2)
            },
            {
                name: 'Super Jump Seconds',
                value: (Math.ceil(superJumpVal[0]) / 60).toFixed(2),
                percent: (superJumpVal[1] * 100).toFixed(2)
            }
        ]
    }

    displayStat(superJumpObj);
}

function calcInkRu(skillObj) {
    const inkResStats = allSkillData[skillObj.skillName];

    const jumpHML = getHML(inkResStats, 'OpInk_JumpGnd');
    const velShotHML = getHML(inkResStats, 'OpInk_VelGnd_Shot');
    const velHML = getHML(inkResStats, 'OpInk_VelGnd');
    const damageLimitHML = getHML(inkResStats, 'OpInk_Damage_Lmt');
    const damageHML = getHML(inkResStats, 'OpInk_Damage');
    const armorHML = getHML(inkResStats, 'OpInk_Armor_HP');

    const jumpVal = calculateAbilityEffect(skillObj.main, skillObj.subs, jumpHML[0], jumpHML[1], jumpHML[2]);
    const velShotVal = calculateAbilityEffect(skillObj.main, skillObj.subs, velShotHML[0], velShotHML[1], velShotHML[2]);
    const velVal = calculateAbilityEffect(skillObj.main, skillObj.subs, velHML[0], velHML[1], velHML[2]);
    const damageLimitVal = calculateAbilityEffect(skillObj.main, skillObj.subs, damageLimitHML[0], damageLimitHML[1], damageLimitHML[2]);
    const damageVal = calculateAbilityEffect(skillObj.main, skillObj.subs, damageHML[0], damageHML[1], damageHML[2]);
    const armorVal = calculateAbilityEffect(skillObj.main, skillObj.subs, armorHML[0], armorHML[1], armorHML[2]);


    const inkResObj = {
        name: 'OpInkEffect_Reduction',
        displayName: 'Ink Resistance Up',
        effects: [
            {
                name: 'Jump in Ink',
                value: jumpVal[0].toFixed(4),
                percent: (jumpVal[1] * 100).toFixed(2)
            },
            {
                name: 'Shoot in Ink',
                value: velShotVal[0].toFixed(4),
                percent: (velShotVal[1] * 100).toFixed(2)
            },
            {
                name: 'Run Speed in Ink',
                value: velVal[0].toFixed(4),
                percent: (velVal[1] * 100).toFixed(2)
            },
            {
                name: 'Damage Limit in Ink',
                value: damageLimitVal[0].toFixed(4),
                percent: (damageLimitVal[1] * 100).toFixed(2)
            },
            {
                name: 'Damage per Frame in Ink',
                value: damageVal[0].toFixed(4),
                percent: (damageVal[1] * 100).toFixed(2)
            },
            {
                name: 'Armor in Ink',
                value: Math.ceil(armorVal[0]),
                percent: (armorVal[1] * 100).toFixed(2)
            }
        ]
    }

    displayStat(inkResObj);
}

function calcBdu(skillObj) {
    // calc bomb defense up values
    const bduStats = allSkillData[skillObj.skillName];

    const specialDamageHML = getHML(bduStats, 'BurstDamageRt_Special');
    const subNearHML = getHML(bduStats, 'BurstDamageRt_SubH');
    const subFarHML = getHML(bduStats, 'BurstDamageRt_SubL');

    const specialDamageVal = calculateAbilityEffect(skillObj.main, skillObj.subs, specialDamageHML[0], specialDamageHML[1], specialDamageHML[2]);
    const subNearVal = calculateAbilityEffect(skillObj.main, skillObj.subs, subNearHML[0], subNearHML[1], subNearHML[2]);
    const subFarVal = calculateAbilityEffect(skillObj.main, skillObj.subs, subFarHML[0], subFarHML[1], subFarHML[2]);

    
    // calc cold-blooded values
    const cbStats = allSkillData['MarkingTime_Reduction'];

    const pointSensorHML = getHML(cbStats, 'MarkingTime_ShortRt');
    const inkMineHML = getHML(cbStats, 'MarkingTime_ShortRt_Trap');
    const silFarHML = getHML(cbStats, 'Silhouette_DistFar');
    const silNearHML = getHML(cbStats, 'Silhouette_DistNear');

    const pointSensorVal = calculateAbilityEffect(skillObj.main, skillObj.subs, pointSensorHML[0], pointSensorHML[1], pointSensorHML[2]);
    const inkMineVal = calculateAbilityEffect(skillObj.main, skillObj.subs, inkMineHML[0], inkMineHML[1], inkMineHML[2]);
    const silFarVal = calculateAbilityEffect(skillObj.main, skillObj.subs, silFarHML[0], silFarHML[1], silFarHML[2]);
    const silNearVal = calculateAbilityEffect(skillObj.main, skillObj.subs, silNearHML[0], silNearHML[1], silNearHML[2]);


    const bombDefenseObj = {
        name: 'BombDamage_Reduction',
        displayName: 'Bomb Defense Up DX',
        effects: [
            {
                name: 'Special Damage Multiplier',
                value: specialDamageVal[0].toFixed(4),
                percent: (specialDamageVal[1] * 100).toFixed(2)
            },
            {
                name: 'Close Hit Sub Damage Multiplier',
                value: subNearVal[0].toFixed(4),
                percent: (subNearVal[1] * 100).toFixed(2)
            },
            {
                name: 'Far Hit Sub Damage Multiplier',
                value: subFarVal[0].toFixed(4),
                percent: (subFarVal[1] * 100).toFixed(2)
            },
            {
                name: 'Marking Time - Point Sensors',
                value: pointSensorVal[0].toFixed(4),
                percent: (pointSensorVal[1] * 100).toFixed(2)
            },
            {
                name: 'Marking Time - Ink Mines',
                value: inkMineVal[0].toFixed(4),
                percent: (inkMineVal[1] * 100).toFixed(2)
            },
            {
                name: 'Thermal-Ink Sillhoute - Far Range Distance',
                value: silFarVal[0].toFixed(4),
                percent: (silFarVal[1] * 100).toFixed(2)
            },
            {
                name: 'Thermal-Ink Sillhoute - Close Range Distance',
                value: silNearVal[0].toFixed(4),
                percent: (silNearVal[1] * 100).toFixed(2)
            }
        ]
    }

    displayStat(bombDefenseObj);
}





// assign dragstart listener on draggable elements
var draggableEle = document.getElementsByClassName('draggable');
for (let i = 0; i < draggableEle.length; i++) {
    draggableEle[i].addEventListener('dragstart', (e) => {
        dragStartHandler(e);
    });
}



// assign dragover, drop listeners on drag-into elements
var dragIntoEle = document.getElementsByClassName('drag-into');
for (let i = 0; i < dragIntoEle.length; i++) {
    dragIntoEle[i].addEventListener('dragover', (e) => {
        dragOverHandler(e);
    });

    dragIntoEle[i].addEventListener('drop', (e) => {
        dropHandler(e);
    });
}




// recalc stats on gear select
// Callback function to execute when mutations are observed
// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
const mutationCallback = function(mutationsList) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
        // fire when attr, specifically 'src', is changed
        if ( (mutation.type === 'attributes') && (mutation.attributeName === 'src') ) {
            setCurrentWeapon(weaponImgEle.dataset.weaponName);
            setCurrentSub(subImgEle.dataset.subName);
            setCurrentSpecial(specialImgEle.dataset.specialName);

            recalculateStats();
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(mutationCallback);

// Start observing the target node for configured mutations
// for skill images
const skillsEle = document.getElementsByClassName('slot-img');
for (let i = 0; i < skillsEle.length; i++) {
    observer.observe(skillsEle[i], { attributes: true });
}

// for weapon, sub, special images
const weaponImgEle = document.getElementById('weapon-img');
const subImgEle = document.getElementById('sub-img');
const specialImgEle = document.getElementById('special-img');
observer.observe(weaponImgEle, { attributes: true });

// for gearset gear images
const gearImgEle = document.getElementsByClassName('gear-img');
for (let i = 0; i < gearImgEle.length; i++) {
    observer.observe(gearImgEle[i], { attributes: true });
}




// get all current skill names
function getInputtedSkillNames() {
    var allSkills = [];

    if (gear) {
        var mainSkillEle = document.getElementById('skill-main');
        var sub1Ele = document.getElementById('skill-sub-1');
        var sub2Ele = document.getElementById('skill-sub-2');
        var sub3Ele = document.getElementById('skill-sub-3');
    
        var mainSkillName = mainSkillEle.children[0].dataset.skillName;
        var sub1SkillName = sub1Ele.children[0].dataset.skillName;
        var sub2SkillName = sub2Ele.children[0].dataset.skillName;
        var sub3SkillName = sub3Ele.children[0].dataset.skillName;
    
        allSkills.push(mainSkillName, sub1SkillName, sub2SkillName, sub3SkillName);
    }
    else if (gearset) {
        var gearTypes = ['head', 'clothes', 'shoes'];

        gearTypes.forEach(gearType => {
            var mainSkillEle = document.getElementById(gearType + '-skill-main');
            var sub1Ele = document.getElementById(gearType + '-skill-sub-1');
            var sub2Ele = document.getElementById(gearType + '-skill-sub-2');
            var sub3Ele = document.getElementById(gearType + '-skill-sub-3');
            
            var mainSkillName = mainSkillEle.children[0].dataset.skillName;
            var sub1SkillName = sub1Ele.children[0].dataset.skillName;
            var sub2SkillName = sub2Ele.children[0].dataset.skillName;
            var sub3SkillName = sub3Ele.children[0].dataset.skillName;

            allSkills.push(mainSkillName, sub1SkillName, sub2SkillName, sub3SkillName);
        });
    }

    return allSkills;
}


// convert AP to main and sub points
function getMainSubPoints(ap) {
    var main = 0;
    var sub = 0;

    while (ap >= 10) {
        main++;
        ap -= 10;
    }

    sub = ap / 3;

    return [main, sub];
}


// get and map number of main and subs to the inputted skill names
function getMainAndSubs(skillNames) {
    
    // mainAndSubs structure:
    // [
    //     'skill name': {
    //         'skillName' : 'skill name',
    //         'main': 1,
    //         'subs': 0
    //     },
    //     'skill name 2': {
    //         'skillName' : 'skill name 2',
    //         'main': 0,
    //         'subs': 3
    //     }
    // ]


    // array of skill objects
    var mainAndSubs = [];

    for (var i = 0; i < skillNames.length; i++) {
        
        if (skillNames[i] != 'Unknown') {
            var skillNameExists = false;
            
            // check if the current skill name exists
            for (var j = 0; j < mainAndSubs.length; j++) {
                if (skillNames[i] == mainAndSubs[j].skillName) {
                    skillNameExists = true;
                    break;  
                } 
            }


            // if skill name does not exist, add it
            if (!skillNameExists) {

                var skillObj = {
                    'skillName': skillNames[i],
                    'main': 0,
                    'subs': 0
                };
    
                
                // set 'main' count
                // if iteration is a multiple of 4
                skillObj.main = ((i + 4) % 4 == 0) ? 1 : 0;
    
                // set 'subs' count
                // run through array and add if same skill name
                var numOfSubs = 0;
                for (k = 0; k < skillNames.length; k++) {
                    if (skillNames[i] == skillNames[k]) numOfSubs++;
                }
    
                // exclude main count
                skillObj.subs = numOfSubs - skillObj.main;
    
    
    
                mainAndSubs.push(skillObj);
            }
        }
    }

    return mainAndSubs;
}




// get high, mid, and low values
function getHML(data, key) {
    var high = 0
    var mid = 0
    var low = 0

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

function getHML_MWPUG(data, key) {
    var high = 0;
    var mid = 0;
    var low = 0;

    if (data[key + "_MWPUG_High"] === 0 || data[key + "_MWPUG_High"] === 0.0 ||
        data["Stand_" + key + "_MWPUG_High"] === 0 || data["Jump_" + key + "_MWPUG_High"] === 0 ||
        data["Stand_" + key + "_MWPUG_High"] === 0.0 || data["Jump_" + key + "_MWPUG_High"] === 0.0) {
        high = 0.0;
    } 
    else {
        high = data[key + "_MWPUG_High"] || data["Stand_" + key + "_MWPUG_High"] || data["Jump_" + key + "_MWPUG_High"];
    }

    if (data[key + "_MWPUG_Mid"] === 0 || data[key + "_MWPUG_Mid"] === 0.0 ||
        data["Stand_" + key + "_MWPUG_Mid"] === 0 || data["Jump_" + key + "_MWPUG_Mid"] === 0 ||
        data["Stand_" + key + "_MWPUG_Mid"] === 0.0 || data["Jump_" + key + "_MWPUG_Mid"] === 0.0) {
        mid = 0.0;
    } 
    else {
        mid = data[key + "_MWPUG_Mid"] || data["Stand_" + key + "_MWPUG_Mid"] || data["Jump_" + key + "_MWPUG_Mid"];
    }

    if (data[key] === 0 || data[key] === 0.0 ||
        data["Stand_" + key] === 0 || data["Jump_" + key] === 0 ||
        data["Stand_" + key] === 0.0 || data["Jump_" + key] === 0.0) {
        low = 0.0;
    } 
    else {
        low = data[key] || data["Stand_" + key] || data["Jump_" + key] || 1.0;
    }


    return [high, mid, low]
}

// main, sub to AP points
function getAPs(numOfMains, numOfSubs) {
    return (10 * numOfMains) + (3 * numOfSubs);
}

// percent difference
function getPercentage(AP) {
    return Math.min( (3.3 * AP) - (0.027 * Math.pow(AP, 2)), 100 );
}

// slope
function getSlope(high, mid, low) {
    if (mid == low) return 0;

    return (mid - low) / (high - low);
}

// lerpN
function getLerpN(percentage, slope) {
    if (slope.toFixed(3) == 0.5) {
        return percentage;
    }
    if (percentage == 0.0) {
        return percentage;
    }
    if (percentage == 1.0) {
        return percentage;
    }
    if (slope != 0.5) {
        return Math.pow( Math.E, -1 * (Math.log(percentage) * Math.log(slope) / Math.log(2)) );
    }
}

// result
function getResult(high, low, lerpN) {
    return low + (high - low) * lerpN;
}

// get the value of an ability's effect value with the current gear's skills
function calculateAbilityEffect(numOfMains, numOfSubs, high, mid, low, ninjaSquid = false) {
    var APs = getAPs(numOfMains, numOfSubs);
    var percentage = getPercentage(APs);
    if (ninjaSquid) percentage *= 0.8;
    var slope = getSlope(high, mid, low);
    var lerpN = getLerpN(percentage / 100, slope);
    var result = getResult(high, low, lerpN);
    if (ninjaSquid) result *= 0.9;

    return [result, lerpN];
}


// display a skill stat
function displayStat(statObj) {
    var containerEle = $('#stats');


    // skill title element
    var skillTitleEle = $('<div class="flex justify-start items-center gap-1 mt-4"></div>');

    var skillImgEle = $('<img />')
        .attr('src', '/storage/skills/' + statObj.name + '.png')
        .attr('alt', statObj.displayName)
        .attr('width', '32px')
    
    var skillNameEle = $('<h5></h5>').text(statObj.displayName);

    skillTitleEle.append(skillImgEle, skillNameEle);


    // stat effect entries
    var statValContainerEle = $('<div class="grid grid-cols-2 gap-2 items-end"></div>');
    for (var i = 0; i < statObj.effects.length; i++) {
        var effectName = statObj.effects[i].name;
        var effectVal = statObj.effects[i].value;
        var effectPercent = statObj.effects[i].percent;


        // create progress bar
        var statContainerEle = $('<div></div>');
        
        var statProgressBarContainerEle = $('<div class="bg-gray-300 relative rounded-full"></div>');
        var statsProgressBarEle = $('<div class="absolute top-0 left-0 h-full bg-pink-300 rounded-full"></div>').css('width', effectPercent + '%');
        
        // use <meter></meter> ? https://www.w3schools.com/TAgs/tag_meter.asp
        var statsProgressBarValPerContainerEle = $('<div class="flex justify-between relative z-10"></div>');
        var statsProgressBarValueEle = $('<div class="ml-6 text-xl font-bold"></div>').text(effectVal).css('-webkit-text-stroke', '0.75px black').css('-webkit-text-fill-color', 'white');
        var statsProgressBarPercentageEle = $('<div class="mr-6 text-xl font-bold"></div>').text(effectPercent + '%').css('-webkit-text-stroke', '0.75px black').css('-webkit-text-fill-color', 'white');

        statsProgressBarValPerContainerEle.append(statsProgressBarValueEle, statsProgressBarPercentageEle);
        statProgressBarContainerEle.append(statsProgressBarEle, statsProgressBarValPerContainerEle);
        statContainerEle.append(effectName, statProgressBarContainerEle);

        statValContainerEle.append(statContainerEle);
    }


    // add to display container
    containerEle.append(skillTitleEle, statValContainerEle);
}