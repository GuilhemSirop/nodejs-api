'use strict'

const port = process.env.PORT || 3000;

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const chai = require('chai');
const mocha = require('mocha');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const Pizza = require('./Model/pizza');

const pizzaController = require('./Controller/pizza/pizzaController');
const ingredientController = require('./Controller/ingredient/ingredientController');
const userController = require('./Controller/userController');
// Pour ouvrir l'API (cross origin) IP acceptée
const cors = require('cors');


// Mongoose connect
mongoose.connect('mongodb://localhost/bestpizza', err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
});

// CONF
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
//var node permettant d'avoir le fichier courant
app.use(express.static(path.join(__dirname, 'View')));
app.use('/ingredients', ingredientController);
app.use('/pizzas', pizzaController);
app.use('/users', userController);

server.listen(port,() => {
    console.log(`Starting WebServer at ${port}`);
});

//server.listen(3000);
/* *** SOCKET.IO *** */
io.on('connection', function (socket) {
  console.log('Tentative !');
  socket.on('on-create-pizza', function (data) {
    console.log('reçu !');
    Pizza.find((err, pizzas) => {
        if (err) {
            //res.status(500).send(err)
        } else {
          socket.emit('update-list-pizzas', pizzas);
          console.log('envoyé !');
        }
    });
  });
});
  
/* *** FIN SOCKET.IO *** */