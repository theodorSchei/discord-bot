// TUTORIAL FOR Å LEGGE TIL COMMANDS:
// https://discordjs.guide/command-handling/#individual-command-files

console.log("Hello");

const fs = require("fs");

// require the discord.js module
const Discord = require("discord.js");

// import the config from the config.json file
const { prefix } = require("./config.json");

// import the bot token from .ENV
require("dotenv").config();

// create a new Discord client
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once("ready", readyDiscord);

function readyDiscord() {
  console.log("Ready!🏎");
}

// login to Discord with your app's token
client.login(process.env.BOT_TOKEN);

client.on("message", gotMessage);
// uses .on rather than .once like in the ready event
// this means that it can trigger multiple times

function gotMessage(msg) {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  if (command.guildOnly && msg.channel.type === "dm") {
    return msg.reply("I can't execute that command inside DMs!");
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${msg.author}!`;
    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return msg.channel.send(reply);
  }

  // COOLDOWNS

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(msg.author.id)) {
    const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return msg.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(msg.author.id, now);
  setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

  try {
    command.execute(msg, args);
  } catch (error) {
    console.error(error);
    msg.reply("there was an error trying to execute that command!");
  }
}
