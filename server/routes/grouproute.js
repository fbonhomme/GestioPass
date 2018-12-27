const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const group_controller = require('../controllers/groupcontroller');

// a simple test url to check that all of our files are communicating correctly.
router.get('/', group_controller.tous);

router.post('/create', group_controller.group_create)
router.get('/:id', group_controller.group_details);
router.put('/:id/update', group_controller.group_update);
router.delete('/:id/delete', group_controller.group_delete);

module.exports = router;