const Discord = require('discord.js')
const config = require('../../config.json')
const fs = require('fs')

module.exports = {

    run: async (message, args, client) => {

        const msg = message.channel
        const cmd = args[0]
        const mp = args.slice(1).join(' ')
        const channel = args[1]

        if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.channel.send({ embeds: [new Discord.MessageEmbed()
            .setColor(config.embed.error)
            .setDescription(config.permission)]})

        switch(cmd) {
            
            case "welcomeMp":
                let view = args[1]
                if(!mp) {
                    msg.send({ embeds: [new Discord.MessageEmbed()
                        .setColor(config.embed.basic)
                        .setDescription(`Bonjour ${message.author}, voici mes variables :`)
                        .addField("⚙️・Configuration message", "`{user}` ➜ Permet de définir le membre \n `{usertag}` ➜ Permet de tag le membre \n `{username}` ➜ Permet de définir le pseudo de l'utilisateur \n `{guild}` ➜ Permet de définir le serveur \n `{espace} / {esp}` ➜ Permet de sauter une ligne")
                        .addField("⚙️・Configuration avancé", "`message / msg` ➜ Permet de voir le message sur vous")
                    ]})
                } else {
                    if(view == "message" || view == "msg") {

                        let mp = `${config.config.mp}`
                        .replace(/{user}/g, message.author)
                        .replace(/{usertag}/g, message.author.tag)
                        .replace(/{username}/g, message.author.username)
                        .replace(/{guild}/g, message.guild.name)
                        .replace(/{esp}/g, "\n")
                        .replace(/{espace}/g, "\n")
                        if(mp == "none") return msg.send({ embeds: [new Discord.MessageEmbed()
                            .setColor(config.embed.error)
                            .setDescription("Vous avez pas configuré de message")
                            ]})
                        msg.send({ embeds: [new Discord.MessageEmbed()
                            .setColor(config.embed.basic)
                            .setDescription(`${mp}`)
                            .setFooter({ text: config.bot.name, iconURL: client.user.displayAvatarURL({dynamic: true}) })
                            .setTimestamp()
                        ]})
    
                    } else {
                    config.config.mp = mp
                    fs.writeFile('./config.json', JSON.stringify(config, null, 2), (err) => {

                    let mp = `${config.config.mp}`
                    .replace(/{user}/g, message.author)
                    .replace(/{usertag}/g, message.author.tag)
                    .replace(/{username}/g, message.author.username)
                    .replace(/{guild}/g, message.guild.name)
                    .replace(/{esp}/g, "\n")
                    .replace(/{espace}/g, "\n")
                    msg.send({ embeds: [new Discord.MessageEmbed()
                        .setColor(config.embed.basic)
                        .setDescription(`${mp}`)
                        .setFooter({ text: config.bot.name, iconURL: client.user.displayAvatarURL({dynamic: true}) })
                        .setTimestamp()
                    ]})
                  })
                }
            }
                if(mp == "none") {

                    config.config.mp = mp
                    fs.writeFile('./config.json', JSON.stringify(config, null, 2), (err) => {
                        msg.send({ embeds: [new Discord.MessageEmbed()
                            .setColor(config.embed.basic)
                            .setDescription("Le message mp de bienvenue à été désactivé")
                            .setFooter({ text: config.bot.name, iconURL: client.user.displayAvatarURL({dynamic: true}) })
                            .setTimestamp()
                        ]})
                    })

                }
                break;
            
            case "logChannel":
                if(!channel) return message.channel.send({ embeds: [new Discord.MessageEmbed()
                    .setColor(config.embed.error)
                    .setDescription("Veuillez mentionner un channel")]})
                config.id.channels.logs = channel.id
                fs.writeFile('./config.json', JSON.stringify(config, null, 2), (err) => {
                msg.channel.send({ embeds: [new Discord.MessageEmbed()
                    .setColor(config.embed.success)
                    .setDescription(`Les messages de verifications sont maintenant dans ${channel}`)
                    ]})
                })
                break;

            case "sanctionChannel":
                if(!channel) return message.channel.send({ embeds: [new Discord.MessageEmbed()
                    .setColor(config.embed.error)
                    .setDescription("Veuillez mentionner un channel")]})
                config.id.channels.sanctions = channel.id
                fs.writeFile('./config.json', JSON.stringify(config, null, 2), (err) => {
                msg.channel.send({ embeds: [new Discord.MessageEmbed()
                    .setColor(config.embed.success)
                    .setDescription(`Les messages de sanctions sont maintenant dans ${channel}`)
                    ]})
                })
                break;
            
            case "verifChannel":
                if(!channel) return message.channel.send({ embeds: [new Discord.MessageEmbed()
                    .setColor(config.embed.error)
                    .setDescription("Veuillez mentionner un channel")]})
                config.id.channels.verif = channel.id
                fs.writeFile('./config.json', JSON.stringify(config, null, 2), (err) => {
                msg.channel.send({ embeds: [new Discord.MessageEmbed()
                    .setColor(config.embed.success)
                    .setDescription(`Les messages de verifications sont maintenant dans ${channel}`)
                    ]})
                    })
                break;

        }

        if(!cmd) {
            msg.send({ embeds: [new Discord.MessageEmbed()
                .setColor(config.embed.basic)
                .addField(`Bonjour / bonsoir,`, "Voici toute les suffix de la commande !config \n\n welcomeMp / logChannel / sanctionChannel / verifChannel")
            ]})
        }

    },
    name: "config"
}