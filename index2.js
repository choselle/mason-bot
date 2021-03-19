require('dotenv').config();
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const TARGETUSERTOANNOY = process.env.TARGETUSERTOANNOY;
const TARGETCHANNELFORCOMMAND = process.env.TARGETCHANNELFORCOMMAND;

const queue = new Map();

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
      if (newState.member.id == TARGETUSERTOANNOY) {
        //followMason(newVoice);
        bot.channels.cache.get(TARGETCHANNELFORCOMMAND).send("!play https://www.youtube.com/watch?v=Zuo4GsJDl-4");
      }
    } else if (newVoice == null) {
      console.log(`${userName} left Discord`);
      //leaveMason(oldVoice);
    } else {
      console.log(`${userName} switched from channel ${oldState.channel.name} to ${newState.channel.name}`);
      //followMason(newVoice);
    }
  }
});

bot.on("message", async message => {
  const prefix = "!";
  //if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else {
    message.channel.send("You need to enter a valid command!");
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voiceChannel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  console.log('getting here at least');
  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voiceChannel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voiceChannel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );

  if (!serverQueue)
    return message.channel.send("There is no song that I could stop!");

  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  console.log(song.url);

  const dispatcher = serverQueue.connection
    .playStream(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

function followMason(channelID) {
  const channel = bot.channels.get(channelID);
  if (!channel) return console.error("The channel does not exist!");
  channel.join().then(connection => {
    // Yay, it worked!
    console.log("Successfully connected.");
  }).catch(e => {
    // Oh no, it errored! Let's log it to console :)
    console.error(e);
  });
}

function leaveMason(channelID) {
  const channel = bot.channels.get(channelID);
  if (!channel) return console.error("The channel does not exist!");
  channel.leave();
}
