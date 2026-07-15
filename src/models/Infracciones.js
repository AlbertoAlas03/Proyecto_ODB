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
    },
    fechas_suspension: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        // La columna real en la DB se llama 'cantidad_fechas_suspencion'
        field: 'cantidad_fechas_suspencion'
    }
}, {
    tableName: 'infracciones',
    timestamps: false
})

export default Infracciones
