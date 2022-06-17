const discord = require('discord.js');
const client = new discord.Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_BANS', 'GUILD_INTEGRATIONS', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGE_REACTIONS'], partials: ['MESSAGE', 'CHANNEL', 'REACTION'], });
const path = require('path')
const fetch = require('cross-fetch');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') })
const guildId = process.env.guild
const clientId = process.env.client
const noblox = require('noblox.js');
const token = process.env.token
const { Configuration, BloxlinkAPI } = require("@morgann1/bloxlink");
const configuration = new Configuration({
    apiKey: process.env.api,
});


const bloxlink = new BloxlinkAPI(configuration);
client.on('ready', async () => {
    client.user.setPresence({ activity: { name: 'Clockwork Cafe' }, status: 'idle' });
    console.log(`Logged in as ${client.user.tag}!`);
	refreshCount();
	onShout()
})

client.on('debug', (log) => {
	if (process.env.debug) console.log(log)
});

client.on('error', (err) => {
	console.log(err)
})
client.commands = new discord.Collection();
const commands = []

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
    client.commands.set(command.data.name, command);
	commands.push(command.data.toJSON());

}

client.on('interactionCreate', async interaction => {
    if (interaction.isModalSubmit()) {
       if (interaction.customId === "suggest") {
        const suggestion = interaction.fields.getTextInputValue('suggestinput');
              const channel = client.channels.cache.get('745593531812413530')
              const embed = new discord.MessageEmbed()
                .setTitle("Suggestion")
                .setDescription(suggestion)
                .setColor("#0099ff")
                .setTimestamp()
                .setFooter('Suggestion by ' + interaction.user.username)
                .setThumbnail(interaction.user.displayAvatarURL())
            const msg = await channel.send({ embeds: [embed] });
                await msg.react('👍')
                await msg.react('🤷')
               await msg.react('👎')
            interaction.reply('Thanks for your suggestion!');
        }
    }
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, bloxlink);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);


let firstShout = true;
let shout;

onShout = async () => {
    let embed = new discord.MessageEmbed();
    let shoutChannel = await client.channels.fetch('746009897102999583');
    if(firstShout == true){
        firstShout = false;
        shout = await noblox.getShout('7023021');
        setTimeout(onShout, 30000);
    } else {
        setTimeout(onShout, 30000);
        let currentShout = await  noblox.getShout('7023021');
        if(!currentShout || typeof currentShout !== 'object' || !currentShout.hasOwnProperty('body')) return;
        if(currentShout.body == shout.body) return;
        embed.setTimestamp()
        if(currentShout.body){
            embed.setDescription(`${currentShout.body}`);
            embed.setColor("GREY");
            embed.setTitle(currentShout.poster.username);
            embed.setThumbnail(`https://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&format=png&username=${currentShout.poster.username}`);
            shoutChannel.send({ embeds: [embed] });
        } else {
            embed.setDescription(`*Shout was cleared.*`);
            embed.setTitle(currentShout.poster.username);
            embed.setColor("GREY");
            embed.setThumbnail(`https://www.roblox.com/Thumbs/Avatar.ashx?x=150&y=150&format=png&username=${currentShout.poster.username}`);
            shoutChannel.send({ embeds: [embed] });
        }
        shout = currentShout;
    }
}


client.on('guildmemberAdd', async member => {
    const embed = new discord.MessageEmbed()
        .setTitle("Welcome to Clockwork Cafe!")
        .setDescription(`Welcome to Clockwork Cafe, ${member.user.username}!`)
        .setColor("#0099ff")
        .setTimestamp()
        .setFooter('Welcome to Clockwork Cafe!')
        .setThumbnail(member.user.displayAvatarURL())
    const channel = client.channels.cache.get('759141707224318013')
    channel.send({ embeds: [embed] });

})


client.on('guildmemberremove', async member => {
    const embed = new discord.MessageEmbed()
        .setTitle("Bye!")
        .setDescription(`I hope you enjoyed being at Clockwork Cafe, ${member.user.username}!`)
        .setColor("#0099ff")
        .setTimestamp()
        .setFooter('Clockwork Cafe')
        .setThumbnail(member.user.displayAvatarURL())
    const channel = client.channels.cache.get('759141707224318013')
    channel.send({ embeds: [embed] });

})

client.on('messageReactionAdd', async (reaction, user) => {
    const id = user.id
    const member = reaction.message.guild.members.cache.get(id)
    if (reaction.message.id == '987326113745346620') {
        member.roles.add('775471708492398602');
    }
    if (reaction.message.id == '987328730462580746') {
        switch (reaction.emoji.name) {
            case '📣':
                member.roles.add('775455219273433178');
                
            case '📚':
                member.roles.add('775455600120954912')
            case '🤝':
                member.roles.add('775455411809681438')
            case '⚒️':
                member.roles.add('775455821916143647')
        }
    }

})

let currentMemberCount = 0;
let firstCheck = true;

let milestones = ['300','350','400','450','500']

let refreshCount = async () => {
    let channel = await client.channels.fetch("745608196340580432")
    let groupResponse = await fetch(`https://groups.roblox.com/v1/groups/7023021`);
    let groupBody = await groupResponse.json();
    let newCount = groupBody.memberCount;
    if(firstCheck === true) {
        firstCheck = false;
        currentMemberCount = newCount;
        return setTimeout(refreshCount, 30000);
    }
    if(milestones.some(milestone => newCount > milestone && currentMemberCount < milestone)) {
        let milestoneReached = milestones.find(milestone => newCount > milestone && currentMemberCount < milestone);
        let embed = new discord.MessageEmbed();
        embed.setTitle('🎉 Milestone Reached!');
        embed.setDescription(`We just hit the ${milestoneReached} group member milestone!`);
        embed.setColor(client.config.colors.success);
        return channel.send({ embeds: [embed]});
    }
    if(newCount !== currentMemberCount) {
        if(newCount > currentMemberCount) {
            channel.send({ content: `⬆️ The group member count has raised! We now have ${newCount} members.` });
        }
        if(newCount < currentMemberCount) {
            channel.send({content: `⬇️ The group member count has lowered! We now have ${newCount} members.` });
        }
    }
    currentMemberCount = newCount;
    setTimeout(refreshCount, 30000);
}

client.login(token);

module.exports = client;