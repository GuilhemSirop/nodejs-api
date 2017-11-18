'use strict';

const mongoose           = require('mongoose');
const server             = require('../server');
const ingredientSchema   = require('../models/ingredient');
const mocha              = require('mocha');
const chai               = require('chai');
const chaiHttp           = require('chai-http');
const should             = chai.should();
      
chai.use(chaiHttp);

describe('Ingredient', () => {

    beforeEach((done) => {
      ingredientSchema.remove({}, () => {
          done();
      });
    });
     

    
    describe('Get All Ingredient', () => {
      it('it should GET all the ingredients', (done) => {
        chai.request(server)
            .get('/ingredients')
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
            done();
        });
      });
    });


    describe('Return ingredient after insert', () => {
      it('it should Return ingredient after insert', (done) => {
          
        const ingredient = new ingredientSchema({ 
            name: "poulet", 
            price: 3 
        });
        
        ingredient.save((err, ingredient) => {
            chai.request(server)
            .get('/ingredients/' + ingredient._id)
            .send(ingredient)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('price');
                res.body.should.have.property('_id').eql(`${ingredient._id}`);
              done();
            });
        });

      });
    }); 

    describe('Create Ingredient', () => {
        it('it should not POST an ingredient without the missing property', (done) => {
            
            let ingredient = {
                name: "poulet",
                description: "Du bon poulet sa mère !"
            };
            
            chai.request(server)
                .post('/ingredients')
                .send(ingredient)
                .end((err, res) => {
                        res.should.have.status(500);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');
                        // Vérification d'une propriété non transmise
                        res.body.errors.should.have.property('price');   
                  done();
                });
        });
  
          
        it('it should POST an ingredient ', (done) => {
            let ingredient = {
                name: "poulet",
                price : 3,
                description: "Du bon poulet sa mère !"
            };
            chai.request(server)
            .post('/ingredients')
            .send(ingredient)
            .end((err, res) => {
                // console.log(res.body);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('price');
                res.body.should.have.property('description');
              done();
            });
        });
    });

         
          
    describe('Update Ingredient', () => {
        it('it should UPDATE a ingredient', (done) => {
            
            let ingredient = new ingredientSchema({
                name: "Poulet", 
                weight: "21Kg", 
                price: 4
            });
            
            ingredient.save((err, ingredient) => {
                chai.request(server)
                .put('/ingredients/' + ingredient._id)
                .send({name: "Coq", price: 3})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name').eql("Coq");
                    res.body.should.have.property('price').eql('3');
                  done();
                });
            });
        });
    });          
          

    describe('Delete Ingredient', () => {
        it('it should DELETE a ingredient', (done) => {
          
            let ingredient = new ingredientSchema({
                name: "Poulet", 
                weight: "10Kg", 
                price: 5
            });
            
            ingredient.save((err, ingredient) => {
                chai.request(server)
                .delete('/ingredients/' + ingredient._id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.ingredient.should.have.property('_id').eql(`${ingredient._id}`);
                  done();
                });
            });
        });
    });          
          
  });
    
