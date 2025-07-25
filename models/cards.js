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
    }
}, {
    timestamps: true
});

game.hasMany(card, {foreignKey: 'gameId'});
card.belongsTo(game, {foreignKey: 'gameId'});

export default card;