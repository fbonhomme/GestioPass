const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');

exports.get_register = (req,res)=>{
    res.render('register',{etat:false});
};
exports.get_login = (req, res)=>{
    res.render('login',{etat:false});
};

exports.get_logout =  (req, res) => {
        req.logout();
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login');
}

exports.register = (req, res) => {
    const {firstName, lastName, email, password, password2} = req.body;
    let errors = [];

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

exports.login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
        })(req, res, next);
      };


