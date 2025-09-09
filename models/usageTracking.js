import { DataTypes } from "sequelize";
import sequelize from "../db/db.js";

const usageTracking = sequelize.define("usageTracking", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    requestCount:{
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    responseTime:{
        type: DataTypes.JSON,
        allowNull:true,
    },
    endpointAccess:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    requestMethod:{
        type:DataTypes.STRING,
        allowNull:false
    },
    statusCode:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
}, {
    tableName:"usageTracking",
    timestamps: true,
    updatedAt: false 
});

export default usageTracking;