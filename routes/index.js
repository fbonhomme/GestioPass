const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const index_controller = require("../controllers/index")

router.get('/', index_controller.get_index);

router.get('/dashboard', ensureAuthenticated, index_controller.get_dashboard)

module.exports = router;