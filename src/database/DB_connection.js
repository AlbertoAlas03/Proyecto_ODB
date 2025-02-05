require('dotenv').config();
// SQL Server configuration, use sql server authentication
const config = {
    user: process.env.DB_USER, //usuario de sql server
    password: process.env.DB_PASSWORD, //contraseña de sql server
    server: process.env.DB_SERVER, // localhost or an IP address
    database: process.env.DB_NAME, // nombre de la base de datos
    options: {
        encrypt: true, // Use this if you're on Azure
        trustServerCertificate: true // Change to false in production
    }
};

module.exports = config;