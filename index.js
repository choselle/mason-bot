require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on("voiceStateUpdate", (oldMember, newMember) => {
  //oldVoice and newVoice returns channelID
  let oldVoice = oldMember.voiceChannelID;
  let newVoice = newMember.voiceChannelID;
  let userName = newMember.user.username;
  if (oldVoice != newVoice) {
    if (oldVoice == null) {
      console.log(`${userName} has joined channel ${newMember.voiceChannel.name}`);
    } else if (newVoice == null) {
      console.log(`${userName} left Discord`);
    } else {
      console.log(`${userName} switched from channel ${oldMember.voiceChannel.name} to ${newMember.voiceChannel.name}`);
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
