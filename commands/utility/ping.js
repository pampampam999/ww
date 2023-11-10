const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.deferReply({content:'Pong!',ephemeral:false});		// Jika ada menunggu akan mengembalikan - Falina is thinking
		const message = await interaction.fetchReply();
		//console.log(message);
		//await interaction.reply({content:'Pong!',ephemeral:true});		// Jika menunggu tidak terlihat respom menunggu
		await wait(1);
		//await interaction.editReply('Pong again!');
		await interaction.followUp({content:'Pong again! and again!',ephemeral:false});				// mem followup dengan pesan baru, jika menggunakan deferreply followup pertama akan mengedit pesan
		//await wait(500);
		//await interaction.deleteReply();									//delete reply

	},
};