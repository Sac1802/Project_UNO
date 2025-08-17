import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import player from "./player.js";

const gameFast = sequelize.define('gameFast', {
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
    tableName: 'game',
    timestamps: true,
    updatedAt: false 
});

player.hasMany(gameFast, {foreignKey: 'game_owner'});
gameFast.belongsTo(player, {foreignKey: 'game_owner'});

player.hasMany(gameFast, { foreignKey: 'current_turn_player_id', as: 'turnGamesFast' });
gameFast.belongsTo(player, { foreignKey: 'current_turn_player_id', as: 'currentPlayerFast' });

export default gameFast;