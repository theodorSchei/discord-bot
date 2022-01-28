module.exports = {
  name: 'emojicount', // name of command
  aliases: ['ec'], // aliases that can be used to call command
  cooldown: 5, // cooldown in seconds
  description: 'Counts the number each emoji is used', // description
  args: false, // if the command takes arguments
  usage: '<argument>', // how to use arguments
  guildOnly: false, // if this is a guildOnly command (not available in dm's)

  execute(msg, args) {
    // This method is called when someone writes the command

    // First get custom emojis from server
    const emojiList = msg.guild.emojis.cache.map((emoji) => emoji.toString());
    let emojisUsed = new Map();

    emojiList.forEach((emoji) => {
      emojisUsed.set(emoji, 0);
    });

    // count all the emojis written
    msg.channel.messages.fetch({ limit: 100 }).then((messages) => {
      console.log(`Received ${messages.size} messages`);
      //Iterate through the messages here with the variable "messages".
      messages.forEach((message) => {
        words = message.toString().split(' ');

        words.forEach((word) => {
          if (emojiList.includes(word)) {
            emojisUsed.set(word, emojisUsed.get(word) + 1);
          }
        });
      });

      msg.channel.send(this.generateMessage(emojisUsed));
    });
  },

  generateMessage(map) {
    out = 'Emojicount: \n';
    map.forEach(function (value, key) {
      out += key + ' : ' + value;
      out += '\n';
    });
    return out;
  },
};
