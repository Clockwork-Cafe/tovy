const discord = require('discord.js');
const client = new discord.Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] });
const path = require('path')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') })
const guildId = process.env.guild
const clientId = process.env.client
const token = process.env.token
const { Configuration, BloxlinkAPI } = require("@morgann1/bloxlink");
const configuration = new Configuration({
    apiKey: process.env.api,
});

const bloxlink = new BloxlinkAPI(configuration);

client.on('ready', () => {
    client.user.setPresence({ activity: { name: 'Clockwork Cafe' }, status: 'idle' });
    console.log(`Logged in as ${client.user.tag}!`);
});
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

client.login(token);