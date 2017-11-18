'use strict'

const port = process.env.PORT || 3000;
const config = require('config');

let express = require('express');
let app = express();
let http = require('http');
let server = http.Server(app);

let io = require('socket.io')(server);

const chai = require('chai');
const mocha = require('mocha');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
// MODELS
const Pizza = require('./models/pizza');
// CONTROLEURS
const pizzaController = require('./controllers/pizzaController');
const ingredientController = require('./controllers/ingredientController');
// Pour ouvrir l'API (cross origin) IP acceptée
const cors = require('cors');


let options = { 
                server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
              }; 

//db connection      
mongoose.connect(config.DBHost, options);
let db = mongoose.connection;
db.on('error', () => {
  console.error.bind(console, 'connection error:');
  process.exit(1);
  }
);


// CONF
app.use(bodyParser.json({limit: '25mb'}));
app.use(bodyParser.urlencoded({extended: true}, {limit: '25mb'}));
app.use(cors());
//var node permettant d'avoir le fichier courant
app.use(express.static(path.join(__dirname, 'View')));
app.use('/ingredients', ingredientController);
app.use('/pizzas', pizzaController);

server.listen(port,() => {
    console.log(`Starting WebServer at ${port}`);
});

// -------------------------------------------------------------------------- //
//                                SOCKET                                      //
// -------------------------------------------------------------------------- //


global.io = io;
module.exports = app;

