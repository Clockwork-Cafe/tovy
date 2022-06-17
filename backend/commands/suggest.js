const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const { Modal } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Suggests a feature"),
  async execute(interaction) {
    const modal = new Modal()
      .setCustomId("suggest")
      .setTitle("Suggest a feature");
    const sugginput = new Discord.TextInputComponent()
      .setCustomId("suggestinput")
      .setLabel("What's your suggestion?")
      .setStyle("PARAGRAPH");
    const firstActionRow = new Discord.MessageActionRow().addComponents(sugginput);
    modal.addComponents(firstActionRow);
    await interaction.showModal(modal);
  },
};
