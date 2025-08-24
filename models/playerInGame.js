import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import game from "./games.js";
import player from "./player.js";

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

game.hasMany(playerInGame, { foreignKey: "id_game", onDelete: "CASCADE" });
playerInGame.belongsTo(game, { foreignKey: "id_game" });

player.hasMany(playerInGame, { foreignKey: "id_player", onDelete: "CASCADE" });
playerInGame.belongsTo(player, { foreignKey: "id_player" });

export default playerInGame;
