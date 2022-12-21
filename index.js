var webserver=require('./keep_alive.js')
const Discord = require("discord.js");
const bot = new Discord.Client();

const yf = require('yahoo-finance-webscraper');
const moment = require("moment-timezone")

bot.on("rateLimit", bot => {
    console.log(bot)
})

bot.on("ready", () => {
    setInterval(() => {
        var day = moment().isoWeekday();
        var hr = moment().tz("America/New_York").format("HH")
        var ticker = ('btc-usd').toUpperCase() //Ticker (BTC-USD is a valid crypto symbol)
        yf.getSingleStockInfo(ticker).then(map => {
            if (map.regularMarketPrice == undefined) throw 'invalid symbol';

            var mapKeys = Object.keys(map);
            if (mapKeys.includes("preMarketPrice") && map.marketState !== 'REGULAR') {
                var price = (map.preMarketPrice).toLocaleString()
            } else if (mapKeys.includes("postMarketPrice") && map.marketState !== 'REGULAR') {
                var price = (map.postMarketPrice).toLocaleString()
            } else {
                var price = (map.regularMarketPrice).toLocaleString()
            }

            var guilds = bot.guilds.cache.map(guild => guild.id);

            for (var i = 0; i < guilds.length; i++) {
                task(i, price, guilds)
            }

            bot.user.setActivity(`${(map.regularMarketChangePercent).toFixed(2)}% | ${map.symbol}`, {
                type: "WATCHING"
            });
        }).catch(err => {
            console.log(err)
        });
    }, 30000); //Changing this will change how fast the ticker updates. The minimum recommended value is 5000

    function task(i, price, guilds) {
        setTimeout(function() {
            var guild = bot.guilds.cache.get(guilds[i]);
            guild.me.setNickname(`${price}`).catch(err => {
                console.log(err)
            });;
        }, 2000 * i);
    }
}
      
      
      );
console.log("Starting...")
bot.login('ODEyNTY3MTA5MjcxODE0MTY1.YDCoFw.2HzvJIN8VdEjx6ZgMVmENn59eYI').then(() => console.log(`Bot successfully initialized`));
