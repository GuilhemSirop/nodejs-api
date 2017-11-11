'use strict';

const express = require('express'),
      router  = express.Router(),
      Ingredient   = require('../../Model/ingredient');

/* *** ROUTE '/' GET => Récupération des éléments *** */
router.get('/', (req, res) => {
    Ingredient.find((err, ingredient) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(ingredient);
        }
    });
});

/* *** ROUTE '/(:id)' GET => Récupération d'un élément en fonction de l'id *** */
router.get('/:id', (req, res) => {
    Ingredient.findById(req.params.id, (err, ingredient) => {
        if (err) {
            res.status(500).send(err)
        } else if (ingredient === null) {
            res.status(404).send(`Pas d'ingredient trouvé avec cet Identifiant...`);
        } else {
            res.status(200).send(ingredient);
        }
    });
});

/* *** ROUTE '/' POST => Ajout d'un élement en base en fonction d'un objet envoyé *** */
router.post('/', (req, res) => {
    
    const ingredient = new Ingredient(req.body);
    
    ingredient.save((err, pizza) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).send(pizza);
    });
});

/* *** ROUTE '/' PUT => Modification d'un élement possédant un id sépcifique *** */
router.put('/:id', (req, res) => {

    Ingredient.findById(req.params.id, (err, ingredient) => {
        if (err) {
            res.status(500).send(err);
        } else if (ingredient === null) {
            res.status(404).send(`Pas de ingredient trouvé avec cet Identifiant...`);
        } else {
            
            ingredient.name = req.body.name || ingredient.name;
            ingredient.description = req.body.description || ingredient.description;
            ingredient.img = req.body.img || ingredient.img;
            ingredient.price = req.body.price || ingredient.price;
            ingredient.updated_at = new Date;
            
            ingredient.save((err, ingredient) => {
                if (err) {
                    res.status(500).send(err);
                }
                
                res.status(200).send(ingredient);
            });
        }
    });
});

/* *** ROUTE '/' DEMETE => Suppression d'un élement possédant un id sépcifique *** */
router.delete('/:id', (req, res) => {
    Ingredient.findByIdAndRemove(req.params.id, (err, ingredient) => {
        if (err) {
            res.status(500).send(err);
        } else if (ingredient === null) {
            res.status(404).send(`Pas d'ingredient trouvé avec cet Identifiant...`);
        } else {
            let response = {
                message: `La ingredient ${req.params.id} a été correctement supprimée`,
                ingredient: ingredient
            };
            res.status(200).send(response);
        }
    });
});

module.exports = router;