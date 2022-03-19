const fs = require("fs");

let weaponResult = {};



console.log("Prepping data to write...");
let done = false;

fs.readFile(__dirname + '/550/WeaponInfo_Main.json', function(err, data) {
    if (err) {
        return console.error(err);
    }

    const weaponData = JSON.parse(data);
    weaponData.forEach(weapon => {
        // get weapon name
        const weaponNameSplit = weapon["Name"].split("_");
        let weaponName = weaponNameSplit[0] + weaponNameSplit[1];

        if (weaponName.includes("Blaster")) {
            weaponName = weaponName.substring(7);
        }


        // bullet stat
        fs.readFile(__dirname + '/550/WeaponBullet/' + weaponName + '.json', function(err, wbData) {
            if (err) {
                return console.error(err);
            }


            if (weaponName in weaponResult) {
                // weapon group exists, just add weapon info
                weaponResult[weaponName][weapon.Name] = weapon;
            }
            else {
                // weapon group does not exist, add weapon group stats and weapon info
                wbData = JSON.parse(wbData);
                weaponResult[weaponName] = wbData; // params {}

                weaponResult[weaponName][weapon.Name] = weapon;


                // add extra stats if need be
                if (weaponName.includes("Spinner") || weaponName.includes("Twins")) {
                    fs.readFile(__dirname + '/550/WeaponBullet/' + weaponName + '_2.json', function(err, wbData2) {
                        if (err) {
                            return console.error(err);
                        }

                        wbData2 = JSON.parse(wbData2);
                        weaponResult[weaponName][weaponName + '_2'] = wbData2['param'];
                    });
                }
                else if (weaponName.includes("Blaster")) {
                    fs.readFile(__dirname + '/550/WeaponBullet/' + weaponName + '_Burst.json', function(err, wbData2) {
                        if (err) {
                            return console.error(err);
                        }

                        wbData2 = JSON.parse(wbData2);
                        weaponResult[weaponName][weaponName + '_burst'] = wbData2['param'];
                    });
                }
                else if (weaponName.includes("Roller")) {
                    fs.readFile(__dirname + '/550/WeaponBullet/' + weaponName + '_Stand.json', function(err, standData) {
                        if (err) {
                            return console.error(err);
                        }

                        fs.readFile(__dirname + '/550/WeaponBullet/' + weaponName + '_Jump.json', function(err, jumpData) {
                            if (err) {
                                return console.error(err);
                            }

                            standData = JSON.parse(standData);
                            jumpData = JSON.parse(jumpData);

                            weaponResult[weaponName][weaponName + '_stand'] = standData['param'];
                            weaponResult[weaponName][weaponName + '_jump'] = jumpData['param'];
                        });
                    });
                }
            }
            
            // if last entry
            if (weapon.Name === 'Umbrella_Compact_02') {
                done = true;
            }
        }); 
    });
});



// async reading above. Check every second if reading data is "done"
setInterval(() => {
    if (done) {
        const preppedData = JSON.stringify(weaponResult);
        
        fs.writeFileSync(__dirname + '/550/parsed-weapons.json', preppedData, function(err) {
            if (err) {
                return console.error(err);
            }
            console.log("Data written successfully!");
            // return 1;
        });
        done = false;
        // return 1;
    } 
}, 1000); // ctrl + C to exit script
