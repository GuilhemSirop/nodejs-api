'use strict';

const express = require('express'),
      router  = express.Router(),

      Pizza   = require('../../Model/pizza');

/* *** ROUTE '/' GET => Récupération des éléments *** */
router.get('/', (req, res) => {
    Pizza.find((err, pizza) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(pizza);
        }
    }).populate('ingredients').
      exec(function (err, story) {
        if (err) return console.log(err);
      });
});

/* *** ROUTE '/(:id)' GET => Récupération d'un élément en fonction de l'id *** */
router.get('/:id', (req, res) => {
    Pizza.findById(req.params.id, (err, pizza) => {
        if (err) {
            res.status(500).send(err)
        } else if (pizza === null) {
            res.status(404).send('Pas de pizza trouvé avec cet Identifiant...')
        } else {
            res.status(200).send(pizza)
        }
    }).populate('ingredients').
      exec(function (err, story) {
        if (err) return console.log(err);
      });
});

/* *** ROUTE '/' POST => Ajout d'un élement en base en fonction d'un objet envoyé *** */
router.post('/', (req, res) => {
    
    const pizza = new Pizza(req.body);
    
    pizza.save((err, pizza) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).send(pizza);
        
    });
});

/* *** ROUTE '/' PUT => Modification d'un élement possédant un id sépcifique *** */
router.put('/:id', (req, res) => {
    
    var pizza = {};
    pizza.name = req.body.name || pizza.name;
    pizza.description = req.body.description || pizza.description;
    pizza.price = req.body.price || pizza.price;
    pizza.updated_at = new Date;
    pizza.ingredients = req.body.ingredients || pizza.ingredients;


    Pizza.findOneAndUpdate({_id: req.params.id}, pizza, (err, pizza) => {
        if (err) {
            res.status(500).send(err);
        } else if (pizza === null) {
            res.status(404).send('Pas de pizza trouvé avec cet Identifiant...');
        } else {
            res.status(200).send(pizza);
        }
    });
});

/* *** ROUTE '/' DEMETE => Suppression d'un élement possédant un id sépcifique *** */
router.delete('/:id', (req, res) => {
    Pizza.findByIdAndRemove(req.params.id, (err, pizza) => {
        if (err) {
            res.status(500).send(err);
        } else if (pizza === null) {
            res.status(404).send('Pas de pizza trouvé avec cet Identifiant...');
        } else {
            let response = {
                message: `La pizza ${req.params.id} a été correctement supprimée`,
                pizza: pizza
            };
            res.status(200).send(response);
        }
    });
});

module.exports = router;