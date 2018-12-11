const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const routes = require('./routes/index');
const users = require('./routes/users');
const mongoose = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const app = express();

// Connect to Mongoose
mongoose.connect('mongodb://localhost:27017/gestiopass', { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected ...'))
    .catch(err => console.log(err))

// Load User Model
require('./models/user');

const User = mongoose.model('User');
//joi Schema

const authDataSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(7).alphanum().required(),
    password2: Joi.string().valid(Joi.ref('password')).required().strict()
});

const loginDataSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(7).alphanum().required(),
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users', users);

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.post('/users', (req, res) => {
    console.log(req.body);
    let errors = [];
    if (!req.body.email) {
        errors.push({ text: "Stop!!! email please !!!" });
    }
    if (errors.length > 0) {
        res.render('', {
            errors: errors,
            email: req.body.email
        })
    } else {
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
    }
});

app.post('/login', (req, res, next) => {

    Joi.validate({
            email: req.body.email,
            password: req.body.password
        },
        loginDataSchema, (err, value) => {
            if (err) {
                console.log(err.details[0]);
                res.status(422).json({
                    status: err.details[0].message
                });
            } else {
                User.findOne({
                    email: req.body.email
                }).then(user => {
                    if (user) {
                        res.json({
                            user: user.email,
                            password: user.password
                        })
                    } else {
                        const error = new Error('That username is not OG');
                        res.status(409);
                        next(error);
                    }
                })


            };
        })
})

app.listen(3000, () => { console.log('connected on port 3000') })