import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";
import player from "./player.js";
import game from "./games.js";

const turnHistory = sequelize.define(
  "turnHistory",
  ({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  })
);

game.hasMany(turnHistory, {foreignKey:  'game_id'});
turnHistory.belongsTo(game, {foreignKey: 'game_id'});

player.hasMany(turnHistory, {foreignKey: 'player_id'});
turnHistory.belongsTo(player, {foreignKey: 'player_id'});

export default turnHistory;