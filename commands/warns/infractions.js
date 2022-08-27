const moment = require('moment')
const Discord = require('discord.js')
const config = require('../../config.json')
const db = require('../../db.json')
moment.locale('fr')
 
module.exports = {
    run: async (message, args, client) => {
        if (!message.member.permissions.has(Discord.Permissions.FLAGS.MODERATE_MEMBERS)) return message.channel.send({ embeds: [new Discord.MessageEmbed()
            .setColor(config.embed.error)
            .setDescription(config.permission.moderate_members)]})
        const member = message.mentions.members.first()
        if (!member) return message.channel.send({ embeds: [new Discord.MessageEmbed()
            .setColor(config.embed.error)
            .setDescription("Veuillez mentionner le membre dont vous voulez voir ces warns")]})
        if (!db.warns[member.id]) return message.channel.send({ embeds: [new Discord.MessageEmbed()
        .setColor(config.embed.basic)
        .setDescription("Ce membre n'a aucun warn")]})
        message.channel.send({ embeds: [new Discord.MessageEmbed()
            .setColor(config.embed.basic)
            .setDescription(`**Total de warns :** ${db.warns[member.id].length}\n\n__**10 derniers warns**__\n\n${db.warns[member.id].slice(0, 10).map((warn, i) => `**${i + 1}.** ${warn.reason}\nSanctionné ${moment(warn.date).fromNow()} par <@!${warn.mod}>`).join('\n\n')}`)
            .setFooter({ text: config.bot.name, iconURL: client.user.displayAvatarURL({dynamic: true})})
            .setTimestamp()]})
        },
    name: 'infractions'
}
 