const Discord = require('discord.js')
const config = require('../../config.json')

module.exports = (client) => {
  console.log("🚀 Client successfully logged in !")
  config.id.client = client.user.id

  const statuses = [
    () => ` Clover Pub`,
    () => `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} membres`
  ]
  let i = 0
  setInterval(() => {
  client.user.setPresence({ activities: [{ name: `${statuses[i]()}`, type: 'STREAMING' }], status: 'online'})
  i = ++i % statuses.length
  }, 1e4)
  function getAllAdsChannelsIDs (category) {
    client.channels.cache.get(category).children.forEach(channel => {
      config.id.channels.pub.push(channel.id);
    })
  }

  for (let category of config.id.categories) {
    getAllAdsChannelsIDs(category);
  }
}
