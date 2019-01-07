const express = require('express');
const Joi = require('joi');
const {loginDataSchema} = require('../Schema/joi');
//const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.get_register = (req,res)=>{
    res.render('register');
}
exports.get_login = (req, res)=>{
    res.render('login');
};
exports.get_logout = (req,res)=>{
    res.render('logout');
}
exports.get_dashboard = (req, res) => {
    res.render('dashboard');
}

exports.register = (req, res) => {
    const {firstName, lastName, email, password, password2} = req.body;
    let errors =[];

    if (!email || !password || !password2){
        errors.push({msg: 'Please enter all fields'});
    }
    if (password != password2) {
        errors.push({msg: 'Passwords do not match'});
    }
    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
      }
    if(errors.length > 0){
        res.render('register',{
            errors,
            email,
            password,
            password2
        });
    } else{
        User.findOne({ email: email }).then(user => {
            if (user) {
              errors.push({ msg: 'Email already exists' });
              res.render('register', {
                errors,
                email,
                password,
                password2
              });
            } else{
                const newUser = new User({
                    firstName,
                    lastName,
                    email,
                    password
                });
           
                 bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(() => {
                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                );
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                        });
                    });
                }
            })
        }
    };

   /* exports.login =  (req, res) => {
        Joi.validate({
                email: req.body.email,
                password: req.body.password
            },
            loginDataSchema, (err, value) => {
                if (err) {
                    console.log(err.details[0]);
                   res.render('login',{msg: err.details[0].message})
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
                                        res.render('login',{msg:'Invalid password'});
                                    }
                                })
                        } else {
                            res.render('login',{msg:'Unknown user'});
                        }
                    })
                };
            })
    } */
