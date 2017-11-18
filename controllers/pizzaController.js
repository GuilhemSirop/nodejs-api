'use strict';

const express = require('express');
const router  = express.Router();
const Pizza   = require('../models/pizza');
// ************************************************************************** //
//                                ROUTES                                      //
// ************************************************************************** //
router.get('/', (req, res, next) => {
    getPizzas(req, res, next);
});

router.get('/:id', (req, res, next) => {
    getPizzaById(req, res, next);
});

router.post('/', (req, res, next) => {
    postPizza(req, res, next);
});

router.put('/:id', (req, res, next) => {
    putPizza(req, res, next);
});

router.delete('/:id', (req, res, next) => {
    deletePizza(req, res, next);
});

// ************************************************************************** //
//                                FONCTIONS                                   //
// ************************************************************************** //
function getPizzas(req, res, next){
    
    Pizza.find((err, pizza) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(pizza);
        }
    }).sort({created_at: 'desc'}).populate({
        path: 'ingredients',
        match: { deleted: false }
    }).exec(function (err, story) {
        if (err) return console.log(err);
     });
     
}

function getPizzaById(req, res, next){
    
    Pizza.findById(req.params.id, (err, pizza) => {
        if (err) {
            res.status(500).send(err)
        } else if (pizza === null) {
            res.status(404).send('Pas de pizza trouvé avec cet Identifiant...')
        } else {
            res.status(200).send(pizza)
        }
    }).populate({
        path: 'ingredients',
        match: { deleted: false }
    }).exec(function (err, story) {
        if (err) return console.log(err);
    });
    
}

function postPizza(req, res, next){
    
    const pizza = new Pizza(req.body);
    
    pizza.save((err, pizza) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(pizza);
            global.io.emit('[Pizza][post]', pizza);
            global.io.emit('[Toast][new]', {type: 'success', title: `Nouvelle Pizza`, message: 'Une nouvelle pizza a été ajoutée !'});
        }
       
    });
    
}

function putPizza(req, res, next){
    
    var pizza = {};
    pizza.name = req.body.name || pizza.name;
    pizza.img = req.body.img || pizza.img;
    pizza.description = req.body.description || pizza.description;
    pizza.price = req.body.price || pizza.price;
    pizza.updated_at = new Date;
    pizza.ingredients = req.body.ingredients || pizza.ingredients;


    Pizza.findOneAndUpdate({_id: req.params.id}, pizza, { new: true }, (err, pizza) => {
        if (err) {
            res.status(500).send(err);
        } else if (pizza === null) {
            res.status(404).send('Pas de pizza trouvé avec cet Identifiant...');
        } else {
            res.status(200).send(pizza);
            
            global.io.emit('[Pizza][put]', pizza);
            global.io.emit('[Toast][new]', {type: 'warning', title: `Pizza ${pizza.name} améliorée`, message: 'Découvrez les améliorations !'});
        }
    });
    
}

function deletePizza(req, res, next){
    
    Pizza.findByIdAndRemove(req.params.id, (err, pizza) => {
        if (err) {
            res.status(500).send(err);
        } else if (pizza === null) {
            res.status(404).send('Aucune pizza trouvée avec cet identifiant...');
        } else {
            let response = {
                message: `La pizza ${req.params.id} a été correctement supprimée`,
                pizza: pizza
            };
            res.status(200).send(response);
            
            global.io.emit('[Pizza][delete]', pizza);
            global.io.emit('[Toast][new]', {type: 'error', title: `La pizza ${pizza.name} indisponible`, message: `Trop tard, la pizza n'est plus diposnible !`});
        }
    });
    
}


module.exports = router;