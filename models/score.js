import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import player from "./player.js";
import game from "./games.js";


const score = sequelize.define('score', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    playerId:{
        type: DataTypes.INTEGER,
        allowNull:  false
    },
    gameId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    score:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    timestamps: true,
    updatedAt: false 
});

player.hasMany(score,  {foreignKey: 'playerId', onDelete: 'CASCADE', hooks: true});
score.belongsTo(player, {foreignKey: 'playerId'});

game.hasMany(score, {foreignKey: 'gameId', onDelete: 'CASCADE', hooks: true});
score.belongsTo(game, {foreignKey: 'gameId'});


export default score;