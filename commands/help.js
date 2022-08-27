const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {

    run: async (message, args, client) => {

        message.channel.send({ embeds: [new Discord.MessageEmbed()
            .setColor(config.embed.basic)
            .addField("⚡ Administration", `↬ Les commandes ci-dessous nécessitent les permissions Admin`)
            .addField("🛋 Définition Config", "`▸ !config ↪ affiche le menu config concernant la définition de la configuration serveur`")
            .addField("💥 Gestion Sanctions", "`▸ !infractions ↪ affiche les infractions \n ▸ !warn ↪ ajoute un warn \n ▸ !unwarn ↪ supprime un warn`")
            .addField("🏆 LeaderBoard", "`▸ !leaderboard ↪ affiche le tableau des points de verification`")
        ]})
        
    },
    name: "help"

}