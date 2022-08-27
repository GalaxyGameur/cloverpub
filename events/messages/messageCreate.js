const Discord = require('discord.js')
const config = require('../../config.json')

module.exports = async (client, message) => {

  if (message.author.bot) return
  //Constantes
  const pubChannels = config.id.channels.pub;
  const verifChannel = client.channels.cache.get(config.id.channels.verif);

  //Si le message vient d'un salon pub
  if (pubChannels.includes(message.channel.id)) {
    message.channel.messages.fetch({ limit: 3}, {cache: true}).then(m => {
      const oldMsg = m.find(m => m.author.id === config.id.client);
      if (oldMsg) oldMsg.delete().catch(err => console.log(err));
    })  

    const pubEmbed = new Discord.MessageEmbed()
      .setColor(config.embed.basic)
      .setAuthor({name: '🍀clover pub' })
      .setDescription(`➜ Votre publicité doit avoir au moins 3 lignes ! \n ➜ Merci de respecter les TOS de et le règlement ! \n ➜ Pas de serveur NSFW !`)
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({ text: config.bot.name, iconURL: client.user.displayAvatarURL({dynamic: true})})
      .setTimestamp()

    const verifEmbed =  new Discord.MessageEmbed()
      .setColor(config.embed.basic)
      .setAuthor({name: `Publicité de ${message.author.username}`, iconURL: message.author.displayAvatarURL()})
      .setDescription(`--------------------------------------------- \n ${message.content} \n --------------------------------------------- \n\n **👤 Auteur :** <@!${message.author.id}>  \n **📌 Salon :** <#${message.channel.id}> \n \n **[🔗 Sauter vers la pub afin d'en savoir plus !](${message.url})**`)
      .setFooter({ text: config.bot.name, iconURL: client.user.displayAvatarURL({dynamic: true})})
      .setTimestamp()

    const row = new Discord.MessageActionRow()
      .addComponents([
        new Discord.MessageButton()
          .setCustomId(`valid/${message.id}/${message.channel.id}`)
          .setLabel('Valider !')
          .setStyle('SUCCESS'),

        new Discord.MessageButton()
          .setCustomId(`invalid/${message.id}/${message.channel.id}`)
          .setLabel('Supprimer !')
          .setStyle('DANGER')
      ]);
    
    message.react('⏳');
    message.channel.send({embeds: [pubEmbed]});
    verifChannel.send({embeds: [verifEmbed], components: [row]});
  }

  const prefix = config.bot.prefix;
  const args = message.content.slice(prefix.length).split(/ +/);
  if(!message.content.toLowerCase().startsWith(prefix)) return;

  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName.slice(prefix.length)))

  if (message.type !== 'DEFAULT' || message.author.bot || !command) return;

  command.run(message, args, client);
}
