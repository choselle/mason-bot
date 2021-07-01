require('dotenv').config();
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const TARGETUSERTOANNOY = process.env.TARGETUSERTOANNOY;

let isSongStarted = false;

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on("voiceStateUpdate", (oldState, newState) => {
  //oldVoice and newVoice returns channelID
  let oldVoice = oldState.channelID;
  let newVoice = newState.channelID;
  let userName = newState.member.user.username;

  if (oldVoice != newVoice) {
    if (oldVoice == null) {
      console.log(`${userName} has joined channel ${newState.channel.name}`);
      console.log(newState.member.id);
      if (newState.member.id == TARGETUSERTOANNOY) {
        followMason(newVoice);
      }
    } else if (newVoice == null) {
      console.log(`${userName} left Discord`);
      if (oldState.member.id == TARGETUSERTOANNOY) {
        leaveMason(oldVoice);
      }
    } else {
      console.log(`${userName} switched from channel ${oldState.channel.name} to ${newState.channel.name}`);
      if (newState.member.id == TARGETUSERTOANNOY) {
        followMason(newVoice);
      }
    }
  }
});

function followMason(channelID) {
  const channel = bot.channels.cache.get(channelID);
  if (!channel) return console.error("The channel does not exist!");
  channel.join().then(connection => {
    if (!isSongStarted) {
      playSong(connection);
    }
    console.log("Successfully connected.");
  }).catch(e => {
    console.error(e);
  });
}

function leaveMason(channelID) {
  const channel = bot.channels.cache.get(channelID);
  if (!channel) return console.error("The channel does not exist!");
  channel.leave();
  isSongStarted = false;
}

function playSong(connection) {
  const dispatcher = connection.play(ytdl('https://www.youtube.com/watch?v=Zuo4GsJDl-4'));
  isSongStarted = true;
  dispatcher.on('finish', () => {
    console.log('Finished playing');
    isSongStarted = false;
    dispatcher.destroy();
  })
}
