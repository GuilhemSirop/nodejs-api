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
/**
 * Get All Pizzas none deleted
 *
 * @param req
 * @param res
 * @param next
 */
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

/**
 * Get Pizza By ID
 *
 * @param req
 * @param res
 * @param next
 */
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

/**
 * Post new Pizza
 *
 * @param req
 * @param res
 * @param next
 */
function postPizza(req, res, next){
    
    const pizza = new Pizza(req.body);
    
    pizza.save((err, pizza) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(pizza);
            // SOCKET
            global.io.emit('[Pizza][post]', pizza);
            global.io.emit('[Toast][new]', {type: 'success', title: `Nouvelle Pizza`, message: 'Une nouvelle pizza a été ajoutée !'});
        }
       
    });
    
}

/**
 * Update Pizza
 *
 * @param req
 * @param res
 * @param next
 */
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
            // SOCKET
            global.io.emit('[Pizza][put]', pizza);
            global.io.emit('[Toast][new]', {type: 'warning', title: `Pizza ${pizza.name} améliorée`, message: 'Découvrez les améliorations !'});
        }
    });
    
}

/**
 * Delete pizza
 *
 * @param req
 * @param res
 * @param next
 */
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
            // SOCKET
            global.io.emit('[Pizza][delete]', pizza);
            global.io.emit('[Toast][new]', {type: 'error', title: `La pizza ${pizza.name} indisponible`, message: `Trop tard, la pizza n'est plus diposnible !`});
        }
    });
    
}


module.exports = router;