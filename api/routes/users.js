const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./../models/user');

router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email })
    .then(doc => {
      if (doc.length > 0) {
        return res.status(422).json({
          message: 'Email already exists'
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user.save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: 'User created'
                });
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                })
              });
          }
        })
      }
    })
});

router.post('/login', (req, res, next) => {
  User.find({ email: req.body.email })
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth Failed'
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth Failed'
          });
        }
        if (result) {
          const token = jwt.sign({
            email: user[0].email,
            id: user[0]._id
          }, process.env.JWT_KEY, {
              expiresIn: "1h"
            })
          return res.status(200).json({
            message: 'Auth successful',
            token: token
          })
        }
        res.status(401).json({
          message: 'Auth Failed'
        });
      });

    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    });
});

router.delete('/:userId', (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .then(result => {
      res.status(200).json({
        message: 'User deleted.'
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});


module.exports = router;