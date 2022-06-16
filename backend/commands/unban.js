const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const path = require('path');
const fetch = require('cross-fetch');
const noblox = require('noblox.js');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const key = process.env.key;
const api = process.env.api;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('unbans a user from the game.')
        .addStringOption(option => option
            .setName('user')
            .setRequired(true)
            .setDescription('The user to unban.')
        ),
	async execute(interaction, bloxlink) {
		const embed1 = new Discord.MessageEmbed()
            .setColor('GREY')
            .setTitle('Banning...')
            .setDescription('Please wait while we unban the user.')
            .setTimestamp()
            .setFooter('Clockwork Cafe');
        const embed2 = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTitle('Success!')
            .setDescription('The user has been unbanned.')
            .setTimestamp()
            .setFooter('Clockwork Cafe');
        const embed3 = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle('Error!')
            .setDescription('The user could not be unbanned.')
            .setTimestamp()
            .setFooter('Clockwork Cafe');
        const reason = interaction.options.getString('reason');
        const user = interaction.options.getString('user');
        await interaction.deferReply()
        try {
            const result = await bloxlink.search(interaction.user.id, process.env.guild);
            const data = await fetch('https://clockwork.brandoge.lol/api/bans/unban', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth': key,
                    'id': result.user.robloxId,
                },
                body: JSON.stringify({
                    username: await user,
                }),
            });
            const json = await data.json();
        } catch (error) {
            console.log(error);
           return await interaction.editReply({ embeds: [embed3]} );
        }
        await interaction.editReply({ embeds: [embed2]} );

	},
};