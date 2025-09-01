import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";
import game from "./games.js";
const OrderGame = sequelize.define(
  "order_game",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_game: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    updatedAt: false,
  }
);

export default OrderGame;

game.hasMany(OrderGame, {foreignKey:  'id_game'});
OrderGame.belongsTo(game, {foreignKey: 'id_game'});