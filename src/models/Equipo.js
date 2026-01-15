import { DataTypes } from 'sequelize'
import sequelize from '../database/DB_connection.js'

const Equipo = sequelize.define('equipo', {
    id_equipo: {
        type: DataTypes.CHAR(5),
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    id_categoria: {
        type: DataTypes.CHAR(4),
        allowNull: false,
        references: {
            model: 'categorias',
            key: 'id_categoria'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'equipo',
    timestamps: false
})

export default Equipo
