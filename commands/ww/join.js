const {SlashCommandBuilder}=require('discord.js');
const { Sequelize,DataTypes } = require('sequelize');

const sequelize = new Sequelize('werewolf', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb'
  });

module.exports={
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Masuke ke game yang telah di buat moderator')
        .addMentionableOption(option =>
            option.setName('user')
                    .setDescription('Mention user yang akan di m asukkan ke dalam game')),
    async execute(interaction){
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }

         // Data model

         const Player = sequelize.define('player', {
            user_id: {
                type:DataTypes.STRING},
            game_id: DataTypes.STRING,
            role: DataTypes.STRING,
            status: DataTypes.BOOLEAN
          },{
            timestamps:false
          }
          );
        
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
        await Player.sync({force:false});

        const guild_id = interaction.guildId;
        const channel_id = interaction.channelId;
        let user_id = interaction.user.id;
        const game_id = await Game.findOne({ where: { guild_id: guild_id ,status:1} });
          
            const mentionUser = await interaction.options.getMentionable('user');
            if(mentionUser){
                const mentionUser_id = await mentionUser.user.id;
                user_id = mentionUser_id;
                console.log(mentionUser_id);
            }
            
        

        if(game_id){
            //console.log(game_id);

            // Inert player to databse players
            try {


                // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
                const coba = await Player.create({
                    user_id: user_id,
                    game_id: game_id.dataValues.id,
                    role: '',
                    status: 1
                });
                
                
                return await interaction.reply(`Pemain ditambahkan <@${user_id}>`);
            }
            catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    return await interaction.reply('That user already exists.');
                }
    
                return await interaction.reply('Something went wrong with adding a user.');
            }
    
        }else{
            console.log(`data tidak ada`);
            await interaction.reply(`Tidak ada game yang berjalan. gunakan /newgame untuk memulai game baru.`);
        }

       
    },
}