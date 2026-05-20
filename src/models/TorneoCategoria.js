import { DataTypes } from 'sequelize';
import sequelize from '../database/DB_connection.js';

const TorneoCategoria = sequelize.define('torneo_categoria', {
    id_torneo: {
        type: DataTypes.CHAR(6),
        allowNull: false,
        primaryKey: true
    },
    id_categoria: {
        type: DataTypes.CHAR(4),
        allowNull: false,
        primaryKey: true
    },
    participo: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    tableName: 'torneo_categoria',
    timestamps: false
})

export default TorneoCategoria
