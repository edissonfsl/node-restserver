require('./config/config');

const express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

/// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// routes
app.use(require('./routes/usuario'));

// db connection
console.log(process.env.URLDB);
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, (err, res) => {
    if (err) throw err;
    console.log('Conexión a Base de Datos exitosa');
});

// server
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto 3000');
});