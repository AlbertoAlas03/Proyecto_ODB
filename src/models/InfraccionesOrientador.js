import { DataTypes } from "sequelize";
import sequelize from "../database/DB_connection";

const InfraccionesOrientador = sequelize.define('InfraccionesOrientador', {
    id_infraccion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'infracciones',
            key: 'id'
        }
    },
    dui_orientador: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'orientador',
            key: 'dui_orientador'
        }
    },
    observacion: {
        type: DataTypes.CHAR(200), 
        allowNull: true
    }
}, {
    tableName: 'infracciones_orientador',
    timestamps: false 
});

export default InfraccionesOrientador;