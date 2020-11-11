module.exports = {
  name: 'image',
  aliases: ['i'],
  cooldown: 5,
  description: 'This sends an image',
  args: false,
  usage: '',
  guildOnly: false,

  execute(msg, args) {
    msg.channel.send('Hei', { files: ['/Users/theodor/Desktop/Bilde.jpeg'] });
  }
};
