var express = require('express');
var router = express.Router();
var VerifyToken = require('../../share/auth/verifyToken');

var user_controller = require('../controllers/usersController');
router.post('/login',user_controller.login);
router.get('/isID', user_controller.isID);
router.post('/isPinner', user_controller.isPinner);
router.post('/isResetPin',user_controller.isResetPin);
router.put('/updatePin',user_controller.updatePin);
router.put('/updatePinFirstTime',user_controller.updatePinFirstTime);
router.post('/updateprofile',user_controller.updateprofile);
module.exports = router;
