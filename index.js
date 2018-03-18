module.exports = function() {
    var fs = require('fs');
    var shell = require('shelli');
    var log = require('js-logs');
    var figlet = require('figlet');
    var readline = require('readline');
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function kill(msg) {
        console.error(msg)
        process.exit(1);
    }

    function modules() {
        rl.write('\nInstalling DiscordJS module. \n(Ignore this if your operating system is not Linux.)\n');
        shell.exec('npm install discord.js');
    }

log.clear();
    console.log(
        log.yellow(
            figlet.textSync('D-Auto', {
                horizontalLayout: 'full'
            })
        )
    );

    rl.question('Do you want to continue? (y/n) \n', (answer) => {
        if (answer.match(/^n(o)?$/i)) rl.close();

        if (answer.match(/^y(es)?$/i)) {

    
        if(!fs.existsSync("./node_modules/discord.js")) // Checks if you do not have discord.js module
            modules();

            rl.write('\n--------Creating the files--------\n');

            const botStream = fs.createWriteStream("client.js");
            let str = new String();
            str += "var Discord = require('discord.js');";
            str += "\nvar client = new Discord.Client();";
            str += "\nvar config = require('./config.json');";
            str += "\nvar prefix = config.client.prefix";
            str += "\n\nclient.on('ready', () => {";
            str += "\n    console.log(`I am ready on ${client.guilds.size} Servers.`);";
            str += "\n    client.user.setPresence({status:'dnd', activity:{name:`${client.guilds.size} servers | sr!help`,type:2, url:null}});";
            str += "\n});";
            str += "\n\nclient.on('message', message => {";
            str += "\n   if (message.content === prefix + 'ping') {";
            str += "\n      message.reply('Pong!');";
            str += "\n}";
            str += "\n});";
            str += "\n\nclient.login(config.client.token)";
            botStream.write(str);
            botStream.end();



            const configStream = fs.createWriteStream("config.json");
            let str2 = new String();
            str2 += '{';
            str2 += '\n   "client": {';
            str2 += '\n        "prefix": "clientPrefix",';
            str2 += '\n        "token": "clientToken"';
            str2 += '\n   }';
            str2 += '\n}';
            configStream.write(str2);
            configStream.end();

            rl.write('\nSuccessfully created the files.\n');



            rl.write('\nPlease make sure you have created your app. If you haven\'t, you can do so at:\nhttps://discordapp.com/developers/applications/me\nPlease answer the following questions.\n\n');
            rl.write('\n--------Configuration Setup--------\n');
            rl.question('What would you like the prefix to be?\n', (answer) => {
                fs.readFile('./config.json', 'utf8', function(err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    var result = data.replace(/clientPrefix/g, answer);

                    fs.writeFile('./config.json', result, 'utf8', function(err) {
                        if (err) return console.log(err);
                    });
                });
                //
                rl.question('Please paste your client token here (Is given when app is created).\n', (answer) => {
                    fs.readFile('./config.json', 'utf8', function(err, data) {
                        if (err) {
                            return console.log(err);
                        }
                        var result = data.replace(/clientToken/g, answer);

                        fs.writeFile('./config.json', result, 'utf8', function(err) {
                            if (err) return console.log(err);
                        });
                    });
                    rl.question('Would you like to start the script? (y/n)\n', (answer) => {
                        if (answer.match(/^y(es)?$/i)) {
                            var plat = process.platform;
                            if(plat === 'win32') {
                                let bat = fs.createWriteStream('run.bat');
                                bat.write('start node client.js');
                                shell.exec('run.bat'); // Opens run.bat
                            } else if (plat === 'darwin' || plat === 'linux') {
                                let sh = fs.createWriteStream('run.sh');
                                var cwd = process.cwd();
                                var str = `
                                #!/bin/bash
                                
                                osascript -e 'tell application "Terminal"
                                    activate
                                    tell application "System Events" to keystroke "t" using command down
                                    repeat while contents of selected tab of window 1 starts with linefeed
                                        delay 0.01
                                    end repeat
                                    do script "cd ${cwd}" in window 1
                                    do script "node client.js" in window 1
                                    end tell'
                                `;
                                sh.write(str);
                                shell.exec('bash ./run.sh');
                            }
                        };
                        if (answer.match(/^n(o)?$/i)) rl.close();
                    });
                });
            });
        }
    });
};
