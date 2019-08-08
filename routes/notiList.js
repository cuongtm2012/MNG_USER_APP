var express = require('express');
var router = express.Router();
var verifyToken = require('../../share/auth/verifyToken');
var noti_controller = require('../controllers/notiListController');

router.post('/list', verifyToken, noti_controller.list);
router.post('/count', verifyToken, noti_controller.count);

module.exports = router;
