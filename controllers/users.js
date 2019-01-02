const mongoose = require('mongoose');
// Load User Model
require('../models/user');

const Joi = require('joi');
const bcrypt = require('bcryptjs');
const {loginDataSchema,authDataSchema} = require('../Schema/joi');
const User = mongoose.model('User');

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
    const {email, password, password2} = req.body;
    let errors =[];

    if (!email || !password || !password2){
        errors.push({msg: 'Please enter all fields'});
    }
    if (password != password2) {
        errors.push({msg: 'Passwords do not match'});
    }
    if(errors.length > 0){
        res.render('register',{
            errors,
            email,
            password,
            password2
        });
    } else {
    Joi.validate({
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        },
        authDataSchema, (err, value) => {
            if (err) {
                console.log(err.details[0].message);
                errors.push({msg : err.details[0].message })
                res.render('register',{
                    errors,
                    email,
                    password,
                    password2
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
                                    req.flash(
                                        'success_msg',
                                        'You are now registered and can log in'
                                      );
                                    res.redirect('/users/login');
                                })
                            .catch(err => console.log(err));
                        })
                })
            }
        });
    }
};
exports.login =  (req, res, next) => {
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
}