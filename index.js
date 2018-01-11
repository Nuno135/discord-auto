const fs = require('fs');

var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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


rl.write('\nPlease make sure you have created your app. If you haven\'t, you can do so at:\nhttps://discordapp.com/developers/applications/me\nPlease answer the following questions.\n\n');
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
      rl.write('\nYour client has been successfully setup. Type \nnode client.js\nto run the client.\nNote: You need to have NodeJS installed for this to work. \nIf you haven\'t already installed it, please do so here:\nnodejs.org/en/download/\n Have fun!\n\n');
      rl.close();
    });
    //
});

