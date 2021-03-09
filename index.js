require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on("voiceStateUpdate", (oldMember, newMember) => {
  let oldVoice = oldMember.voiceChannelID;
  let userName = newMember.user.username;
  let newVoice = newMember.voiceChannelID;
  if (oldVoice != newVoice) {
    if (oldVoice == null) {
      console.log(userName + " joined!");
    } else if (newVoice == null) {
      console.log(userName + " left!");
    } else {
      console.log(userName + " switched channels!");
      console.log(newVoice);
    }
  }
});

bot.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
    msg.channel.send('#play mason song');

    const channel = bot.channels.get("818899793123868688");
    if (!channel) return console.error("The channel does not exist!");
    channel.join().then(connection => {
      // Yay, it worked!
      console.log("Successfully connected.");
    }).catch(e => {
      // Oh no, it errored! Let's log it to console :)
      console.error(e);
    });
  }
});
