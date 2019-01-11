const express = require('express');
const router = express.Router();

// controller
const Login_controller = require("../controllers/users")

router.get('/register', Login_controller.get_register)

router.get('/login', Login_controller.get_login);

router.post('/register', Login_controller.register);
router.post('/login', Login_controller.login );

router.get('/logout', Login_controller.get_logout);

module.exports = router;