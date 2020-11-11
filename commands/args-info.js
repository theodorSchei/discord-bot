module.exports = {
  name: "args-info",
  aliases: ['ai', 'a-i'],
  cooldown: 5, 
  description: "Information about the arguments provided. FOR DEBUGGING 🐞",
  args: true,
  usage: "<any> <amount> <of> <args>",
  guildOnly: false,

  execute(message, args) {
    if (!args.length) {
      return message.channel.send(
        `You didn't provide any arguments, ${message.author}!`
      );
    } else if (args[0] === "foo") {
      return message.channel.send("bar");
    }

    message.channel.send(
      `Arguments: ${args}\nArguments length: ${args.length}`
    );
  }
};
