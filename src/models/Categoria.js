import { DataTypes } from 'sequelize';
import sequelize from '../database/DB_connection.js';

const Categoria = sequelize.define('categorias', {
    id_categoria: {
        type: DataTypes.CHAR(4),
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    edadmax: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    edadmin: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    estado: {
        type: DataTypes.CHAR(20),
        allowNull: true,
        defaultValue: 'activo',
        validate: {
            isIn: {
                args: [['activo', 'inactivo']],
                msg: 'El estado debe ser "activo" o "inactivo".'
            }
        }
    }
}, {
    tableName: 'categorias',
    timestamps: false
})

export default Categoria