var express = require('express');
var router = express.Router();
var verifyToken = require('../../share/auth/verifyToken');
var notice_controller = require('../controllers/noticeController');

router.get('/list', verifyToken, notice_controller.notice);
router.get('/image', notice_controller.noticeimage);

module.exports = router;