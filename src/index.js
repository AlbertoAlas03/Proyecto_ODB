'use strict'
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const sql = require('mssql');
const config = require('./database/DB_connection');
require('dotenv').config();

//function for the connection to the database
async function DB_test() {
    try {
        const pool = await sql.connect(config);
        console.log('Conexión exitosa');
        await pool.close();
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
