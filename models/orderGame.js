import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const OrderGame = sequelize.define(
  "order_game",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_game: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_game: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "order_game",
    timestamps: true,
    updatedAt: false,
  }
);

export default OrderGame;
