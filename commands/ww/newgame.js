const {SlashCommandBuilder }=require('discord.js');
const { Sequelize,DataTypes } = require('sequelize');

const sequelize = new Sequelize('werewolf', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb'
  });

module.exports={
    data: new SlashCommandBuilder()
        .setName('newgame')
        .setDescription('Moderator membuat game baru'),
    async execute(interaction){
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }

        // Data model

        const Game = sequelize.define('game', {
            guild_id: {
                type:DataTypes.STRING},
            channel_id: DataTypes.STRING,
            mod_id: DataTypes.STRING,
            status: DataTypes.BOOLEAN
          },{
            timestamps:false
          }
          );
    
        // Digunakan untuk menyingkronkan table di MySQL
        //await Game.sync({alter:true});
        // await Game.sync({force:true});

        const guild_id = interaction.guildId;
        const channel_id = interaction.channelId;
        const mod_id = interaction.user.id;

      // mencari dulu apa ada game yang active di server itu
      try {
        const game_id = await Game.findOne({
          attributes:[
            [sequelize.fn('MAX',sequelize.col('id')),'maxId']
          ],
          where:{
            guild_id:guild_id,
            status:1
          }
        });

        if(game_id.dataValues.maxId===null){
          // Jika sebelumnya tidak ada data maka membuat data baru
        }else{
          //console.log('Terdapat game yang berjalan');
          return await interaction.reply('Terdapat game yang berjalan');
        }
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          return await interaction.reply('That tag already exists.');
        }
  
        return await interaction.reply('Something went wrong with search a tag.');
      }


    // Menambahkan data ke dalam database
      try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			const game = await Game.create({
				guild_id: guild_id,
				channel_id: channel_id,
				mod_id: mod_id,
                status: 1
			});

			return await interaction.reply({content:`Game Baru Telah Di Buat Oleh ${interaction.user.username}(<@${interaction.user.id}>)`,ephemeral:false});
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return await interaction.reply('That tag already exists.');
			}

			return await interaction.reply('Something went wrong with adding a tag.');
		}

        
        
        
        
    },
}