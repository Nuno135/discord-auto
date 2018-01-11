const fs = require('fs');

var shell = require('shelljs');

var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function modules() {
  rl.write(`\nInstalling NODEJS V8(Ignore this if your operating system is not Linux.)\n`);
  shell.exec('curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash');
  shell.exec('sudo apt-get install -y nodejs');
  rl.write('\nInstalling DiscordJS module(Ignore this if your operating system is not Linux.)\n');
  shell.exec('npm install discord.js');
}

modules();

rl.write('\n--------Creating the  files--------\n');

const botStream = fs.createWriteStream("client.js");
botStream.write("var Discord = require('discord.js');");
botStream.write("\nvar client = new Discord.Client();");
botStream.write("\nvar config = require('./config.json');");
botStream.write("\nvar prefix = config.client.prefix");
botStream.write("\n\nclient.on('ready', () => {");
botStream.write("\n    console.log(`I am ready on ${client.guilds.size}`);");
botStream.write("\n});");
botStream.write("\n\nclient.on('message', message => {");
botStream.write("\n   if (message.content === prefix + 'ping') {");
botStream.write("\n      message.reply('Pong!');");
botStream.write("\n}");
botStream.write("\n});");
botStream.write("\n\nclient.login(config.client.token)");
botStream.end();



const configStream = fs.createWriteStream("config.json");
configStream.write('{');
configStream.write('\n   "client": {');
configStream.write('\n        "prefix": "clientPrefix",');
configStream.write('\n        "token": "clientToken"');
configStream.write('\n   }');
configStream.write('\n}');
configStream.end();

rl.write('\nSuccessfully created the files.\n');



rl.write('\nPlease make sure you have created your app. If you haven\'t, you can do so at:\nhttps://discordapp.com/developers/applications/me\nPlease answer the following questions.\n\n');
rl.write('\n--------Configuration Setup--------\n');
rl.question('What would you like the prefix to be?\n', (answer) => {
    fs.readFile('./config.json', 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      var result = data.replace(/clientPrefix/g, answer);
    
      fs.writeFile('./config.json', result, 'utf8', function (err) {
         if (err) return console.log(err);
      });
    });
    //
    rl.question('Please paste your client token here (Is given when app is created).\n', (answer) => {
        fs.readFile('./config.json', 'utf8', function (err,data) {
          if (err) {
            return console.log(err);
          }
          var result = data.replace(/clientToken/g, answer);
        
          fs.writeFile('./config.json', result, 'utf8', function (err) {
             if (err) return console.log(err);
          });
        });
        rl.question('Would you like to start the script? \n', (answer) => {
          if (answer.match(/^y(es)?$/i)) shell.exec('node client.js');
          if (answer.match(/^n(o)?$/i)) rl.close();
        });
    });
});



rl.on('SIGINT', () => {
  rl.question('Are you sure you want quit the process? ', (answer) => {
    if (answer.match(/^y(es)?$/i)) rl.close();
  });
});

