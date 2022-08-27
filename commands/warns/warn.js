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
            .setDescription("Veuillez mentionner le membre à warn")]})
        if (member.id === message.guild.ownerID) return message.channel.send({ embeds: [new Discord.MessageEmbed()
            .setColor(config.embed.error)
            .setDescription("Vous ne pouvez pas warn le propriétaire du serveur")]})
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 && message.author.id !== message.guild.ownerID) return message.channel.send({ embeds: [new Discord.MessageEmbed()
            .setColor(config.embed.error)
            .setDescription("Vous ne pouvez pas warn ce membre")]})
        const reason = args.slice(1).join(' ')
        if(!reason) {
            res = "Aucune raison spécifié";
        } else {
            res = reason
        }
        if (!db.warns[member.id]) db.warns[member.id] = []
        db.warns[member.id].unshift({
            reason,
            date: Date.now(),
            mod: message.author.id
        })
        fs.writeFileSync('./db.json', JSON.stringify(db))
        message.channel.send(`**${member} a été warn pour ${reason} !**`)

        if(db.warns[message.author.id].length >= 2) {
            let muterole = message.guild.roles.cache.find(r => r.name === "muted")
            if(!muterole) {
                try{
                    muterole = await message.guild.roles.create({
                            name: "muted", 
                            color: "BLACK"
                    })

                    message.guild.channels.cache.forEach(async (channel, id) => {
                    await channel.permissionOverwrites.edit(muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    SEND_TTS_MESSAGES: false,
                    ATTACH_FILES: false,
                    SPEAK: false,
                    CONNECT: false
                    }).catch((e) => { console.error(e) })
                })
                } catch(e) {
                    console.log(e.stack);
                }
              }
              member.roles.add(muterole.id)
          }

    },
    name: 'warn',
    guildOnly: true
}