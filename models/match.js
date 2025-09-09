import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const match = sequelize.define(
  "match",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    updatedAt: false,
  }
);

export default match;
