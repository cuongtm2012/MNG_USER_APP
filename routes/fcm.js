var express = require('express');
var router = express.Router();
var verifyToken = require('../../share/auth/verifyToken');
var noti_controller = require('../controllers/fcmController');

router.post('/registerDevice', verifyToken, noti_controller.registerDevice);
router.post('/registerNoti', verifyToken, noti_controller.registerNoti);
module.exports = router;