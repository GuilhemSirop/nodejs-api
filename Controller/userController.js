'use strict';

/* CONTROLEUR USER */
const express = require('express'),
      router  = express.Router(),
      jwt = require('jsonwebtoken'),
      bcrypt = require('bcrypt'),
      User   = require('../Model/user');



exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
};


router.get('/', (req, res) => {
    User.find((err, user) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(user);
        }
    });
});

// SIGN IN EN POST PAR SECURITE
router.post('/signin', (req, res) => {
     User.findOne({
        email: req.body.email
      }, function(err, user) {
        if (err) throw err;
        if (!user) {
          res.status(401).json({ message: 'Authentication failed. The credentials were wrong.' });
        } else if (user) {
          if (!user.comparePassword(req.body.password)) {
            res.status(401).json({ message: 'Authentication failed. The credentials were wrong.' });
          } else {
            return res.json({token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id}, 'RESTFULAPIs')});
          }
        }
      });
});

// REGISTER
router.post('/', (req, res) => {
    console.log('coucou');
    const newUser = new User(req.body);
      newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
      newUser.save(function(err, user) {
        if (err) {
          return res.status(400).send({
            message: err
          });
        } else {
          user.hash_password = undefined;
          return res.json(user);
        }
      });
});



module.exports = router;