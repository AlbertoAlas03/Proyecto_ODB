import { DataTypes } from 'sequelize';
import sequelize from '../database/DB_connection.js';

const Torneo = sequelize.define('torneo', {
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
    anio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'año'
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
    tableName: 'torneo',
    timestamps: false
})

export default Torneo
