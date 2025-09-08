import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

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

export default score;