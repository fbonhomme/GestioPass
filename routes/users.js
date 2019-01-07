const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// controller
const Login_controller = require("../controllers/users")

router.get('/register', Login_controller.get_register)

router.get('/login', Login_controller.get_login);
router.get('/dashboard', Login_controller.get_dashboard)

router.get('/logout', Login_controller.get_logout);

//router.post('/login', Login_controller.login );

router.post('/register', Login_controller.register);



router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/users/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  });


module.exports = router;