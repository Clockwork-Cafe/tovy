const db = require('../db/db');
const client = require('../discord');
const discord = require('discord.js');
const noblox = require('noblox.js');
module.exports = class LoggingEngine {
    constructor() {

    }

    async newLog(message, userid) {
        let count = await db.log.countDocuments({});
        const logdata = {
            id: count + 1,
            userId: userid,
            message: message
        }
        db.log.create(logdata);
        const channel = client.channels.cache.get('753183958958735411');
        const user = await noblox.getUsernameFromId(Number(userid));
        const embed = new discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle('New Log Alert')
            .setDescription(`${user} ${message}`)
            .setTimestamp()
            .setFooter('clockwork');
        channel.send({ embeds: [embed] });
        return logdata;
    }
    async newAutomationLog(message) {
        let count = await db.log.countDocuments({});
        const logdata = {
            id: count + 1,
            automation: true,
            message: message
        }
        db.log.create(logdata);
        return logdata;
    }


}