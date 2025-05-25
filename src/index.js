'use strict'
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./database/DB_connection');
require('dotenv').config();
require('./models/Relaciones');

//function for the connection to the database
const DB_test = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión exitosa');
        await sequelize.sync({ force: false }); //creacion de tablas 
    } catch (error) {
        console.log("error al conectar a sql server: ", error);
    }
}

//check if the connection to the database is successful
DB_test();


//settings
const port = process.env.PORT || 3002;
app.set('json spaces', 2);

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

//routes
app.use(require('./routes/index'));

//starting the server
app.listen(port, () => {
    console.log('Server listening on port ' + port)
})
