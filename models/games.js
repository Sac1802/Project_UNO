import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

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

export default game;