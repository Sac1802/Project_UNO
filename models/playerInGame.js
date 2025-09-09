import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const playerInGame = sequelize.define("players_in_game", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_game: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_player: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cardsPlayer: {
    type: DataTypes.JSON,  
    allowNull: true,
    defaultValue: []        
  },
}, {
  tableName: "players_in_game",
  timestamps: false            
});

export default playerInGame;
