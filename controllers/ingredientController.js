'use strict';

const express = require('express');
const router  = express.Router();
const Ingredient   = require('../models/ingredient');
// ************************************************************************** //
//                                ROUTES                                      //
// ************************************************************************** //
router.get('/', (req, res, next) => {
    getIngredients(req, res, next);
});

router.get('/:id', (req, res, next) => {
  getIngredientById(req, res, next);
});

router.post('/', (req, res, next) => {
    postIngredient(req, res, next);
});

router.put('/:id', (req, res, next) => {
  putIngredient(req, res, next);
});

router.delete('/:id', (req, res, next) => {
  deleteIngredient(req, res, next);
});


// ************************************************************************** //
//                                FONCTIONS                                   //
// ************************************************************************** //
/**
 * Get All ingredients none deleted
 *
 * @param req
 * @param res
 * @param next
 */
function getIngredients(req, res, next){
    
    Ingredient.find({ 'deleted': false },(err, ingredient) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(ingredient);
        }
    });
    
}

/**
 * Get Ingredient by ID
 *
 * @param req
 * @param res
 * @param next
 */
function getIngredientById(req, res, next){
    
     Ingredient.findById(req.params.id, (err, ingredient) => {
        if (err) {
            res.status(500).send(err)
        } else if (ingredient === null) {
            res.status(404).send(`Aucun ingredient trouvé avec cet identifiant...`);
        } else {
            res.status(200).send(ingredient);
        }
    }); 
    
}

/**
 * Create new Ingredient
 *
 * @param req
 * @param res
 * @param next
 */
function postIngredient(req, res, next){
    
    const ingredient = new Ingredient(req.body);
    ingredient.save((err, pizza) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).send(pizza);
    });
}

/**
 * Update Ingredient
 *
 * @param req
 * @param res
 * @param next
 */
function putIngredient(req, res, next){

    let ingredient = {};
    ingredient.name = req.body.name || ingredient.name;
    ingredient.description = req.body.description || ingredient.description;
    ingredient.img = req.body.img || ingredient.img;
    ingredient.price = req.body.price || ingredient.price;
    ingredient.deleted = req.body.deleted || ingredient.deleted;
    ingredient.updated_at = new Date;


    Ingredient.findOneAndUpdate({_id: req.params.id}, ingredient, { new: true }, (err, ingredient) => {
        if (err) {
            res.status(500).send(err);
        } else if (ingredient === null) {
            res.status(404).send('Aucun ingredient trouvé avec cet Identifiant...');
        } else {
            res.status(200).send(ingredient);
        }
    });
    
}

/**
 * Delete Ingredient
 *
 * @param req
 * @param res
 * @param next
 */
function deleteIngredient(req, res, next){
    
    Ingredient.findByIdAndRemove(req.params.id, (err, ingredient) => {
        if (err) {
            res.status(500).send(err);
        } else if (ingredient === null) {
            res.status(404).send(`Aucun ingredient trouvé avec cet identifiant...`);
        } else {
            let response = {
                message: `L'ingredient ${req.params.id} a été correctement supprimé`,
                ingredient: ingredient
            };
            res.status(200).send(response);
        }
        next();
    });
    
}

module.exports = router;