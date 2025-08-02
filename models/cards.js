import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";
import game from "./games.js";

const card = sequelize.define('card', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    color:{
        type: DataTypes.STRING,
        allowNull: false
    },
    value:  {
        type: DataTypes.STRING,
        allowNull: false
    },
    gameId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isDiscarded:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    timestamps: true,
    updatedAt: false 
});

game.hasMany(card, {foreignKey: 'gameId', onDelete: 'CASCADE', hooks: true});
card.belongsTo(game, {foreignKey: 'gameId'});

export default card;