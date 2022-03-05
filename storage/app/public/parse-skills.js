const fs = require("fs");

let skillResult = {};
const playerSpecFilenames = fs.readdirSync(__dirname + '/550/Player/');



console.log("Prepping data to write...");
let done = false;

playerSpecFilenames.forEach((filename, i) => {
    fs.readFile(__dirname + '/550/Player/' + filename, function(err, data) {
        if (err) {
            return console.error(err);
        }

        const skillData = JSON.parse(data);
        const skillName = Object.keys(skillData)[0];
        
        skillResult[skillName] = skillData[skillName];

        if (i + 1 === playerSpecFilenames.length) {
            done = true;
        }
    });
});

// async reading above. Check every second if reading data is "done"
setInterval(() => {
    if (done) {
        const preppedData = JSON.stringify(skillResult);
        
        fs.writeFileSync(__dirname + '/550/parsed-skills.json', preppedData, function(err) {
            if (err) {
                return console.error(err);
            }
            console.log("Data written successfully!");
        });
        done = false;
    } 
}, 1000); // ctrl + C to exit script
