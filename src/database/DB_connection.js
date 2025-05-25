require('dotenv').config();
const { Sequelize } = require('sequelize');

exports.sequelize = new Sequelize(
    process.env.DATABASE, // nombre de la base de datos
    process.env.USER,     // usuario de SQL Server
    process.env.PASSWORD, // contraseña
    {
        host: process.env.SERVER, // servidor SQL
        dialect: 'mssql',
        logging: false,
        dialectOptions: {
            options: {
                encrypt: false,
                trustServerCertificate: true
            }
        }
    }
)
