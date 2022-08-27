const { readdirSync } = require('fs')

const loadEvents = (bot, dir = './events') => {
    readdirSync(dir).forEach(dirs => {
        const events = readdirSync(`${dir}/${dirs}`).filter(files => files.endsWith(".js"));

        for (const event of events) {
        const evt = require(`../${dir}/${dirs}/${event}`);
        const evtName = event.split(".")[0];
        bot.on(evtName, evt.bind(null, bot));

        console.log(`✅ L'évènement ${evtName} a bien été chargée !`);
        };
    });
};

const loadButtons = (bot, dir = './events/interactions/buttons') => {
    readdirSync(dir).forEach(dirs => {
        const buttons = readdirSync(`${dir}/${dirs}`).filter(files => files.endsWith(".js"));

        for (const file of buttons) {
            const command = require(`../${dir}/${dirs}/${file}`);
            bot.buttons.set(command.name, command);
            //console.log(`✅ Le bouton ${command.name} a bien été chargée !`);
        };
    });
};

module.exports = {
    loadEvents,
    loadButtons
}