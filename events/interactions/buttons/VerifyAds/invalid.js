const Discord = require('discord.js')
const fs = require('fs')
const config = require('../../../../config.json')
const db = require('../../../../db.json')
const quick = require('quick.db')

module.exports = {
    name: "invalid",

    run: async (interaction, args, client) => {
      if (!interaction.member.roles.cache.has(config.id.staff)) return interaction.reply({ephemeral: true, content: `Vous n'avez pas le rôle <@&${config.id.staff}> !`});
        const messageID = args[0];
        const channelID = args[1];
        const row = interaction.message.components[0]
        const message = await client.channels.cache.get(channelID).messages.fetch(messageID).catch(err => console.log(err));

        const reasonRow = new Discord.MessageActionRow()
          .addComponents(
            new Discord.MessageSelectMenu()
              .setCustomId(`reasonMenu`)
              .setPlaceholder('❓ Pour quelle raison supprimez-vous cette pub ?')
              .addOptions([
                {
                  label: 'Pub sans description !',
                  description: 'La publicité ne contient aucune information !',
                  emoji: '📋',
                  value: 'description',
                }, 
                {
                  label: 'Lien(s) invalide(s) !',
                  description: 'Le lien ne fonctionne pas ou est malveillant !',
                  emoji: '🔗',
                  value: 'link',
                },
                {
                  label: 'Raison autre:',
                  description: 'Aucune de ces possibilité ne correspond !',
                  emoji: '📝',
                  value: 'autre',
                },
                {
                  label: 'Je me suis trompé !',
                  description: 'Souhaitez-vous annuler l\'action ?',
                  emoji: '❌',
                  value: 'fail',
                }
            ])
        )

        interaction.update({components: [reasonRow], fetchReply: true})
        .then(res => {
            filter = i => i.customId === 'reasonMenu' && i.user.id === interaction.user.id;
            res.awaitMessageComponent({filter})
            .then(i => {
                const verifEmbed =  interaction.message.embeds[0]

                async function removeAd (r) {
                  quick.add(`${interaction.user.id}.verifs`, 1)
                  message.delete().catch(err => console.log(err))

                    const invalidEmbed = new Discord.MessageEmbed()
                      .setColor(config.embed.error)
                      .setAuthor({name: `Publicité refusée par ${interaction.user.tag} !`, iconURL: interaction.user.displayAvatarURL()})
                      .setDescription(`${interaction.message.embeds[0].description} \n \n **❌ Publicité refusée** par ${interaction.user.username}`)
                      .setFooter({ text: config.bot.name, iconURL: client.user.displayAvatarURL({dynamic: true}) })
                      .setTimestamp()
                      .setThumbnail('https://cdn.discordapp.com/attachments/871123050114998322/873311588768170074/image1.png')

                      const sanctionEmbed = new Discord.MessageEmbed()
                      .setColor(config.embed.error)
                      .setAuthor({name: `Publicité refusée par ${interaction.user.username} !`, iconURL: interaction.user.displayAvatarURL()})
                      .setDescription(`👤 Auteur ・ ${message.author.tag} \n 🕵️‍♂️ Modérateur・${interaction.user.tag}\n ❓ Raison・${r} !`)
                      .setFooter({ text: config.bot.name, iconURL: client.user.displayAvatarURL({dynamic: true}) })
                      .setTimestamp()
                      .setThumbnail('https://cdn.discordapp.com/attachments/871123050114998322/873311588768170074/image1.png')

                  interaction.message.delete().catch(err => console.log(err))
                  
                  const verifyChannel = member.guild.channels.cache.find(c => c.id === config.id.channels.logs)
                  if(!verifyChannel) return console.log()
                  client.channels.cache.get(config.id.channels.logs).send({embeds: [invalidEmbed]})

                  const sanctionChannel = member.guild.channels.cache.find(c => c.id === config.id.channels.sanctions)
                  if(!sanctionChannel) return console.log()
                  client.channels.cache.get(config.id.channels.sanctions).send({embeds: [sanctionEmbed]})

                    const reason = i.values[0]
                    if (!db.warns[message.author.id]) db.warns[message.author.id] = []
                    db.warns[message.author.id].unshift({
                        reason,
                        date: Date.now()
                    })
                    fs.writeFileSync('./db.json', JSON.stringify(db))

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
                      message.guild.members.cache.get(message.author.id).roles.add(muterole.id)
                  }
              }

                switch (i.values[0]) {
                    case "description":
                        removeAd("la publicité ne contient aucune information");
                        break;
                    case "link":
                        removeAd("le lien ne fonctionne pas ou est malveillant");
                        break;
                    case "autre":
                        removeAd("quelque chose pose problème (autre)");
                        break;
                    case "fail":
                        i.update({embeds: [verifEmbed], components: [row]});
                        break;
                    default:
                        break;
                }
            })
        })
    }
}