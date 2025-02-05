// SQL Server configuration, use sql server authentication
const config = {
    user: 'sa', //usuario de sql server
    password: '123456', //contraseña de sql server
    server: 'localhost', // localhost or an IP address
    database: 'bd_oratorio', // nombre de la base de datos
    options: {
        encrypt: true, // Use this if you're on Azure
        trustServerCertificate: true // Change to false in production
    }
};

module.exports = config;