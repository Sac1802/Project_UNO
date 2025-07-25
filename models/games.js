import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const game = sequelize.define('game', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title:{
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
    }
}, {
    timestamps: true,
    updatedAt: false 
});

export default game;