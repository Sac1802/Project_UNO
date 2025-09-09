import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const turnHistory = sequelize.define(
  "turnHistory",
  {
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
    tableName: "turnHistory",
    timestamps: true,
  }
);

export default turnHistory;
