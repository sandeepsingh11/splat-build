const fs = require("fs");

let subSpecialResult = {
    'subs': {},
    'specials': {}
};


console.log("Prepping data to write...");
let subDone = false;
let specialDone = false;


// read sub data
fs.readFile(__dirname + '/550/WeaponInfo_Sub.json', function(err, data) {
    if (err) {
        return console.error(err);
    }

    const subData = JSON.parse(data);
    subData.forEach(sub => {
        if (sub.Id < 100) {
            const subName = sub.Name;
            let subInternalName = subName;

            if (subName.includes("Bomb_")) {
                subInternalName = subName.replace("Bomb_", "Bomb")
            }
            if (subName == "TimerTrap") {
                subInternalName = "Trap";
            }
            if (subName.includes("Poison") || subName.includes("Point")) {
                subInternalName = "Bomb" + subName;
            }
            if (subName == "Flag") {
                subInternalName = "JumpBeacon";
            }

            subSpecialResult.subs[subName] = sub;

            fs.readFile(__dirname + '/550/WeaponBullet/' + subInternalName + '.json', function(err, bulletData) {
                if (err) {
                    return console.error(err);
                }
                
                bulletData = JSON.parse(bulletData);
                subSpecialResult.subs[subName]['param'] = bulletData['param'];
            });
        }

        if (sub.Name === 'VictoryClam') {
            subDone = true;
        }
    });
});


// read special data
fs.readFile(__dirname + '/550/WeaponInfo_Special.json', function(err, data) {
    if (err) {
        return console.error(err);
    }

    const specialData = JSON.parse(data);
    specialData.forEach(special => {
        if (special.Id != 15 && 
            special.Id != 16 && 
            special.Id != 13 && 
            special.Id <= 18 
        ) {
            let specialInternalName = special.Name;

            if (special.Name.includes("Launcher")) {
                specialInternalName = "Bomb" + special.Name.replace("Launcher", "") + "Launcher";
            }

            subSpecialResult.specials[special.Name] = special;

            fs.readFile(__dirname + '/550/WeaponBullet/' + specialInternalName + '.json', function(err, bulletData) {
                if (err) {
                    return console.error(err);
                }
                
                bulletData = JSON.parse(bulletData);
                subSpecialResult.specials[special.Name]['param'] = bulletData['param'];
            });
        }

        if (special.Name === 'BigLaser') {
            specialDone = true;
        }
    });
});


// async reading above. Check every second if reading data is "done"
setInterval(() => {
    if (subDone && specialDone) {
        const preppedData = JSON.stringify(subSpecialResult);
        
        fs.writeFileSync(__dirname + '/550/parsed-subs-specials.json', preppedData, function(err) {
            if (err) {
                return console.error(err);
            }
            console.log("Data written successfully!");
            // return 1;
        });
        subDone = false;
        specialDone = false;
        // return 1;
    } 
}, 1000); // ctrl + C to exit script
