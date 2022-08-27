const Discord = require('discord.js')
const config = require('../config.json')

module.exports = {





































































































    run: async (message, args, client) => {

        message.channel.send({ embeds: [new Discord.MessageEmbed()
            .setColor('BLUE')
            .setDescription("Ce bot a été développé par l'équipe AZ !")
            .addField("Ce que l'équipe AZ fait ?", "Création de bot public et privé \n Multifonction, modération et custom")
            .addField("Mais aussi ?", "Tout cela est totalement gratuit \n sous limite de temps par rapport au projet")
            .addField("Nous rejoindre !", "Vous trouverez un lien d'invitation juste en dessus \n vous pourrez prendre contacte et même jouer avec nos petits bijoux \n https://discord.gg/Cw7puu6hra \n\n Bien cordialement le créateur de l'équipe AZ: Galaxy game#4052")
        ]})
    },
    name: "az"
}