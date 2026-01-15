const { DataTypes } = require('sequelize')
const { sequelize } = require('../database/DB_connection');


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

module.exports = { Infracciones };