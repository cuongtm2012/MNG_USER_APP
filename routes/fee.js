var express = require('express');
var router = express.Router();
var verifyToken = require('../../share/auth/verifyToken');
var fee_controller = require('../controllers/feeController');

router.get('/allfee',verifyToken, fee_controller.allfee);
module.exports = router;