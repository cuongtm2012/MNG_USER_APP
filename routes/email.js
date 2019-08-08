var express = require('express');
var router = express.Router();
var VerifyToken = require('../../share/auth/verifyToken');

var email_controller = require('../controllers/emailController');
router.get('/send', email_controller.send);
router.get('/pincode', email_controller.pincode);
module.exports = router;
