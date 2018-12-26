const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//mongoose.set('useFindAndModify', false);
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const {loginDataSchema,authDataSchema} = require('../Schema/joi');

// Load User Model
require('../models/user');
const User = mongoose.model('User');

//Load Schema Joi
//require('../Schema/joi');

router.get('/register', (req,res)=>{
    res.render('register');
})

router.get('/login', (req,res)=>{
    res.render('login');
});
router.get('/dashboard',(req, res) => {
    res.render('dashboard');
})

router.get('/logout', (req,res)=>{
    res.render('logout');
});

router.post('/login', (req, res, next) => {
    Joi.validate({
            email: req.body.email,
            password: req.body.password
        },
        loginDataSchema, (err, value) => {
            if (err) {
                console.log(err.details[0]);
               res.render('login',{status: err.details[0].message})
            } else {
                User.findOne({
                    email: req.body.email
                })
                .then(user => {
                    if (user) {
                        bcrypt
                            .compare(req.body.password, user.password)
                            .then((result) => {
                                if(result) {
                                    res.render('dashboard',{
                                        id: user._id,
                                        user: user.email,
                                    });
                                } else{
                                    res.render('login',{status:'Unable to login'});
                                }
                            })
                    } else {
                        res.render('login',{status:'That username not exist'});
                    }
                })
            };
        })
});

router.post('/register', (req, res) => {
     
    Joi.validate({
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        },
        authDataSchema, (err, value) => {
            if (err) {
                console.log(err.details[0]);
                res.status(422).json({
                    status: err.details[0].message
                });
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt,
                        (err, hash) => {
                            const newUser = {
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                email: req.body.email,
                                password: hash
                            }
                            new User(newUser)
                                .save()
                                .then(user => {
                                    res.redirect('/users/login');
                                })
                        })
                })
            }
        });
});


module.exports = router;