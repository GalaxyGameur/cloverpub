const Discord  = require('discord.js')
const config = require('../config.json')
const db = require('quick.db')
 
module.exports = {
    run: async (message, args, client) => {

    if (!message.member.permissions.has(Discord.Permissions.FLAGS.MODERATE_MEMBERS)) return message.channel.send({ embeds: [new Discord.MessageEmbed()
        .setColor(config.embed.error)
        .setDescription(config.permission)]})


    let sorted = [];
    const top3 = []
    
    db.all().forEach(table => {
        if (table.data.verifs) sorted.push(table.data.verifs)
    })

    sorted = sorted.sort((a, b) => a - b).reverse()
    
    let i = 0;
    while (i < (sorted.length)) {
        db.all().forEach(table => {
            const verifs = table.data.verifs;
            if (verifs === sorted[i] && verifs !== undefined) {
                top3.push(table.ID)
                i++;
            }
        })
    }

    let txt = '';
    for (let n = 0; n < top3.length; n++) {
        let medal = '';
        if (n === 0) medal = '🥇';
        if (n === 1) medal = '🥈';
        if (n === 2) medal = '🥉';
        if (n > 2) medal = `**${i}.**`

        txt += `> ${medal} <@!${top3[n]}> avec **${db.get(`${top3[n]}.verifs`)} points !** \n`;
    }

    const embed = new Discord.MessageEmbed()
        .setTitle('🏆 LeaderBoard | Voici le Top')
        .setDescription(`${txt === "" ? "❌ Aucune vérification recensée !" : "**Voici les membres avec le plus de vérification !** \n\n" + txt}`)
        .setColor(config.embed.basic)
        .setFooter({ text: config.bot.name, iconURL: client.user.displayAvatarURL({dynamic: true})})
        .setTimestamp()

    message.channel.send({embeds: [embed]})
    },
    name: "leaderboard",
    aliases: ["lb"] 
}