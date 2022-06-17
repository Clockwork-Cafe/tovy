const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const client = require('../discord');
const noblox = require('noblox.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Verified you'),
	async execute(interaction, bloxlink) {
		const user = interaction.user.id;
        const guild = interaction.guild.id;
        const lookingForUserEmbed  = new Discord.MessageEmbed()
            .setColor('GREY')
            .setTitle('Looking for user...')
            .setDescription('Please wait while we look for the user.')
            .setTimestamp()
            .setFooter('Clockwork Cafe');
        
        interaction.reply({ embeds: [lookingForUserEmbed] });
        const userFoundEmbed  = new Discord.MessageEmbed()
            .setColor('GREEN')
            .setTimestamp()
            .setFooter('Clockwork Cafe')
            .setDescription('User found! You have been verified.');
    
        const userNotFoundEmbed  = new Discord.MessageEmbed()
            .setColor('RED')
            .setTimestamp()
            .setFooter('Clockwork Cafe')
            .setDescription('User not found! You have not been verified!')
            .setTitle('Verify')
            .setURL('https://blox.link');

        const userAlreadyVerifiedEmbed  = new Discord.MessageEmbed()
            .setColor('RED')
            .setTimestamp()
            .setFooter('Clockwork Cafe')
            .setDescription('User already verified!')
            .setTitle('Verify')


        const errorEmbed = new Discord.MessageEmbed()
            .setColor('RED')
            .setTimestamp()
            .setFooter('Clockwork Cafe')
            .setDescription('An error has occured!')
            .setTitle('Verify')
            .setURL('https://blox.link');

        const robloxUser = await bloxlink.search(user, guild);
        if (robloxUser.success == false) {
            return interaction.editReply({ embeds: [errorEmbed]}); 
        } else {
            if (!robloxUser.user.robloxId) {
                return interaction.editReply({ embeds: [userNotFoundEmbed]}); 
            } else {
                const robloxName = await noblox.getUsernameFromId(robloxUser.user.robloxId);
                if (robloxName == null) {
                    return interaction.editReply({ embeds: [userNotFoundEmbed]}); 
                }
                const member = interaction.member
                
                    interaction.member.setNickname(robloxName).catch(() => interaction.user.send('I could not update your nickname while attempting to verify you.'))
                    const rankId = await noblox.getRankInGroup(7023021, robloxUser.user.robloxId);
                    if (rankId == null) {
                        member.roles.add(interaction.guild.roles.cache.get('746051542423044136'))
                    }

                    const roleToAdd = await noblox.getRankNameInGroup(7023021, robloxName);
                    if (roleToAdd == null) {
                        member.roles.add(interaction.guild.roles.cache.get('746051542423044136'))
                    }

                    const dcordrole = interaction.guild.roles.cache.find(role => role.name.toLowerCase() == roleToAdd.toLowerCase());
                    interaction.member.roles.add(dcordrole);
                    const verified = interacction.guild.roles.cache.get('757609619215614053');
                    interaction.member.roles.add(verified);
                    
                        
                return interaction.editReply({ embeds: [userFoundEmbed]});
            }
        }
	},
};