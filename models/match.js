import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import game from "./games.js";
import player from "./player.js";

const match = sequelize.define('match', {
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    id_game:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_player:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    updatedAt: false 
});

game.hasMany(match, {foreignKey:  'id_game'});
match.belongsTo(game, {foreignKey: 'id_game'});

player.hasMany(match, {foreignKey: 'id_player'});
match.belongsTo(player, {foreignKey: 'id_player'});

export default match;