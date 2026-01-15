
import { DataTypes } from "sequelize";
import sequelize from "../database/DB_connection.js";

const Infracciones_jugador = sequelize.define('infracciones_jugador', {
    id_infraccion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'infracciones',
            key: 'id_infraccion'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    id_jugador: {
        type: DataTypes.CHAR(7),
        allowNull: false,
        references: {
            model: 'jugadores',
            key: 'id_jugador'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    observacion: {
        type: DataTypes.CHAR(200),
        allowNull: false
    },
    fecha_amonestacion: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'infracciones_jugador',
    timestamps: false
})

export default Infracciones_jugador
