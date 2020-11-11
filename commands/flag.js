// import the dataset for valid country codes
let countryData = require("../resources/country_codes.json");

module.exports = {
  name: "flag",
  aliases: ['fg', 'flags'],

  cooldown: 5,
  description:
    "This bot takes a two letter country code as argument and returns the country's flag 🏳!",
  args: true,
  usage: '<Country code>',
  guildOnly: false,


  execute(msg, args) {
    if (args.length != 1) {
      // if there is more than one argument
      msg.channel.send("❌ Only one country code or name is allowed");
    } else if (args[0].length > 2) {
      // if the argument is more than 2 characters
      if (findCountryCodeFromName(args[0]) != null) {
        var url = makeFlagUrl(findCountryCodeFromName(args[0]));
        msg.channel.send(url);
      }
    } else if (!validateCountryCode(args[0])) {
      // if the country code is not found in country_codes.json
      msg.channel.send("❌ That country code is not found!");
    } else {
      var url = makeFlagUrl(args[0]);
      msg.channel.send(findCountryNameFromCode(args[0]));
      msg.channel.send(url);
    }
  }
};

function makeFlagUrl(countryCode) {
  return `https://www.countryflags.io/${countryCode}/flat/64.png`;
}

function validateCountryCode(countryCode) {
  var searchField = "Code";
  for (var i = 0; i < countryData.length; i++) {
    if (countryData[i][searchField] == countryCode.toUpperCase()) {
      return true;
    }
  }
  return false;
}

function findCountryNameFromCode(countryCode) {
  var searchField = "Code";
  for (var i = 0; i < countryData.length; i++) {
    if (countryData[i][searchField] == countryCode.toUpperCase()) {
      return countryData[i]["Name"];
    }
  }
  return null;
}

function findCountryCodeFromName(countryName) {
  var searchField = "Name";
  for (var i = 0; i < countryData.length; i++) {
    if (
      countryData[i][searchField].toLowerCase() == countryName.toLowerCase()
    ) {
      return countryData[i]["Code"];
    }
  }
  return null;
}
