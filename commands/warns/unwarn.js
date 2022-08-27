const Discord  = require('discord.js')
const config = require('../../config.json')
const db = require('../../db.json')
const fs = require('fs')
 
module.exports = {
    run: async (message, args, client) => {
        if (!message.member.permissions.has(Discord.Permissions.FLAGS.MODERATE_MEMBERS)) return message.channel.send({ embeds: [new Discord.MessageEmbed()
            .setColor(config.embed.error)
            .setDescription(config.permission)]})
        const member = message.mentions.members.first()
        if (!member) return message.channel.send({ embeds: [new Discord.MessageEmbed()
            .setColor(config.embed.error)
            .setDescription("Veuillez mentionner le membre à unwarn")]})
        if (!db.warns[member.id]) return message.channel.send({ embeds: [new Discord.MessageEmbed()
            .setColor(config.embed.error)
            .setDescription("Ce membre n'a aucun warn")]})
        const warnIndex = parseInt(args[1], 10) - 1
        if (warnIndex < 0 || !db.warns[member.id][warnIndex]) return message.channel.send({ embeds: [new Discord.MessageEmbed()
            .setColor(config.embed.error)
            .setDescription("Ce warn n'existe pas")]})
        const { reason } = db.warns[member.id].splice(warnIndex, 1)[0]
        if (!db.warns[member.id].length) delete db.warns[member.id]
        fs.writeFileSync('./db.json', JSON.stringify(db))
        message.channel.send({ embeds: [new Discord.MessageEmbed()
            .setColor(config.embed.success)
            .setDescription(`${member} a été unwarn pour ${reason} !`)]})

            if(db.warns[message.author.id].length <= 2) {
                let muterole = message.guild.roles.cache.find(r => r.name === "muted")
                  member.roles.remove(muterole.id)
              }

    },
    name: 'unwarn'
}