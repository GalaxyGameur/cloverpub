const Discord = require('discord.js')
const config = require('../../../../config.json')
const quick = require('quick.db')

module.exports = {
  name: "valid",

  run: async (interaction, args, client) => {
    if (!interaction.member.roles.cache.has(config.id.staff)) return interaction.reply({ephemeral: true, content: `Vous n'avez pas le rôle <@&${config.id.staff}> !`});
    const messageID = args[0]
    const channelID = args[1]
    
    const message = await client.channels.cache.get(channelID).messages.fetch(messageID).catch(err => console.log(err))
    
    message.reactions.cache.get("⏳").remove().catch(err => console.log(err))
    message.react('✅')

    quick.add(`${interaction.user.id}.verifs`, 1)

    
    const validatedEmbed = new Discord.MessageEmbed()
      .setColor(config.embed.success)
      .setAuthor({name: `Publicité acceptée par ${interaction.user.tag} !`, iconURL: interaction.user.displayAvatarURL()})
      .setDescription(`${interaction.message.embeds[0].description} \n \n **✅ Publicité vérifiée** par ${interaction.user.username}`)
      .setFooter({ text: config.bot.name, iconURL: client.user.displayAvatarURL({dynamic: true}) })
      .setTimestamp()
      .setThumbnail('https://cdn.discordapp.com/attachments/871123050114998322/873311588172582952/image0.png')

    interaction.deferUpdate()
    interaction.message.delete().catch(err => console.log(err))

    const verifyChannel = member.guild.channels.cache.find(c => c.id === config.id.channels.logs)
    if(!verifyChannel) return console.log()
    client.channels.cache.get(config.id.channels.logs).send({embeds: [validatedEmbed]})

  }
}