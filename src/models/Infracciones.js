import { DataTypes } from "sequelize";
import sequelize from "../database/DB_connection.js";

const Infracciones = sequelize.define('infracciones', {
    id_infraccion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    nombre_infraccion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion_infraccion: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'infracciones',
    timestamps: false
})

export default Infracciones
