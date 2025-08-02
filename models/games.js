import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import player from "./player.js";

const game = sequelize.define('game', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    status:  {
        type: DataTypes.STRING,
        allowNull: false
    },
    max_players: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rules: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    game_owner: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    current_turn_player_id:{
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: true,
    updatedAt: false 
});

player.hasMany(game, {foreignKey: 'game_owner'});
game.belongsTo(player, {foreignKey: 'game_owner'});

player.hasMany(game, { foreignKey: 'current_turn_player_id', as: 'turnGames' });
game.belongsTo(player, { foreignKey: 'current_turn_player_id', as: 'currentPlayer' });

export default game;