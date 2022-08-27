const { loadEvents, loadButtons } = require('./utils/loader')
const Discord = require('discord.js')
util = require("util")
fs = require('fs')
readdir = util.promisify(fs.readdir)
path = require("path")
const config = require('./config.json')

const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_PRESENCES]});

client.commands = new Discord.Collection()
client.buttons = new Discord.Collection()

function command(dir, callback) {
    fs.readdir(dir, function(err, files) {
        if (err) throw err;
        files.forEach(function(file) {
            //console.log(`Loading a total of ${files.length} commands.`);
            var filepath = path.join(dir, file);
            fs.stat(filepath, function(err,stats) {
                if (stats.isDirectory()) {
                    command(filepath, callback);
                } else if (stats.isFile() && file.endsWith('.js')) {
                    let props = require(`./${filepath}`);
                    console.log("%c[COMMAND]", "color: orange" , `Loading Command: ${file} ✔`);
                    client.commands.set(props.name, props);
                }
            });
        });
    });
}

command(`./commands/`)
loadEvents(client)
loadButtons(client)

client.on('GuildMemberAdd', async(member) => {

    if(config.config.mp == "none") return console.log()
    let mp = `${config.config.mp}`
    .replace(/{user}/g, member)
    .replace(/{usertag}/g, member.user.tag)
    .replace(/{username}/g, member.user.username)
    .replace(/{guild}/g, member.guild.name)
    .replace(/{esp}/g, "\n")
    .replace(/{espace}/g, "\n")

    const embed = new Discord.MessageEmbed()
    .setColor(config.embed.basic)
    .setDescription(`${mp}`)
    .setFooter({ text: config.bot.name, iconURL: client.user.displayAvatarURL({dynamic: true}) })
    .setTimestamp()

    member.send({ embeds: [embed] })
})

client.login(config.token)