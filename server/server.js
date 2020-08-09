const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();

const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

let server = http.createServer(app);

// IO = Esta es la comunicacion del backend
// Lo exporto para poder manejarlo desde un archivo independiente al server.js, por ello luego hago un require 
// del archivo ya configurado.

module.exports.io = socketIO(server);
require('./socket/socket');

server.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ port }`);

});