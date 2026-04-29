import { DataTypes } from "sequelize"
import sequelize from "../database/DB_connection.js"

const OrientadorEquipo = sequelize.define('orientador_equipo', {
    dui_orientador: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true
    },
    id_equipo: {
        type: DataTypes.CHAR(5),
        allowNull: false,
        primaryKey: true
    },
    rol: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'orientador_equipo',
    timestamps: false
})

export default OrientadorEquipo
