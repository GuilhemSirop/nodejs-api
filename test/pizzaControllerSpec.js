'use strict';

const mongoose      = require('mongoose');
const server        = require('../server');
const pizzaSchema   = require('../models/pizza');
const mocha         = require('mocha');
const chai          = require('chai');
const chaiHttp      = require('chai-http');
const should        = chai.should();

chai.use(chaiHttp);

     
describe('Pizza', () => {

    beforeEach((done) => {
      pizzaSchema.remove({}, () => {
          console.log('Clean collection');
          done();
      });
    });
     
    describe('Get All Pizza', () => {
      it('it should GET all the pizzas', (done) => {
        chai.request(server)
            .get('/pizzas')
            .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    Object.keys(res.body).length.should.to.eql(0);    
                    done();
            });
      });
    });


    describe('Create Pizza', () => {
        
        it('it should not POST a pizza without the missing property', (done) => {
            let pizza = {
                // name: "test",
                description: "Une incroyable pizza !!",
                price: 2900,
                img: "dfgdf",
                ingredients: []
            };
            chai.request(server)
                .post('/pizzas')
                .send(pizza)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('name');
                    res.body.errors.name.should.have.property('kind').eql('required');    
                    done();
                });
            
        });
          
        it('it should POST a pizza ', (done) => {
            let pizza = {
                name: "Reine",
                description: "La meilleure pizza",
                price: 15,
                img : "nothing",
                ingredients: []
            };
            chai.request(server)
            .post('/pizzas')
            .send(pizza)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('description');
                res.body.should.have.property('price');
                res.body.should.have.property('img');
                res.body.should.have.property('ingredients');
                done();
            });
            
        });
        
    });


    describe('Get By Id', () => {
        
      it('it should GET a pizza by the given id', (done) => {
          
        let pizza = new pizzaSchema({ name: "maxipizza", description: "Une grosse pizza pour les gros mangeurs", price: 1954, img: "ggguyg",  ingredients: [] });
        pizza.save((err, pizza) => {
            chai.request(server)
            .get('/pizzas/' + pizza.id)
            .send(pizza)
            .end((err, res) => {
                // console.log(res.body);
                // console.log(pizza.id);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('description');
                res.body.should.have.property('price');
                res.body.should.have.property('ingredients');
                res.body.should.have.property('_id').eql(pizza.id);
                done();
            });
        });
    
      });
    });          
       
        
    describe('PUT Pizza', () => {
        
        it('it should UPDATE a pizza', (done) => {
            
        let pizza = new pizzaSchema({
            name: "Reine", 
            description: "La meilleure Pizza", 
            price: 15, 
            img: "ihbiu", 
            ingredients: [] 
        });
        
        pizza.save((err, pizza) => {
            chai.request(server)
                .put('/pizzas/' + pizza.id)
                .send({description: "Une très bonne pizza", price: 18})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('price').eql('18');
                    res.body.should.have.property('description').eql("Une très bonne pizza");
                  done();
                });
            });
        });
        
    });          
          

    describe('Delete Pizza', () => {
        
        it('it should DELETE a pizza', (done) => {
            
            let pizza = new pizzaSchema({
                name: "Reine", 
                description: "Une magnifique pizza", 
                price: 855, 
                img: "ihbiu", 
                ingredients: [] 
            });
            
            pizza.save((err, pizza) => {
                chai.request(server)
                    .delete('/pizzas/' + pizza._id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message');
                      done();
                    });
            });
            
        });
        
    });          
          
});