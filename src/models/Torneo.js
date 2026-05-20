import { DataTypes } from 'sequelize';
import sequelize from '../database/DB_connection.js';

const Torneo = sequelize.define('torneos', {
    id_torneo: {
        type: DataTypes.CHAR(6),
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    nombre_torneo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    año: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    fecha_cierre: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    estado: {
        type: DataTypes.CHAR(20),
        allowNull: true,
        defaultValue: 'activo',
        validate: {
            isIn: {
                args: [['activo', 'inactivo', 'finalizado']],
                msg: 'El estado debe ser "activo", "inactivo" o "finalizado".'
            }
        }
    }
}, {
    tableName: 'torneos',
    timestamps: false
})

export default Torneo
