var express = require('express');
var router = express.Router();
var verifyToken = require('../../share/auth/verifyToken');
var post_controller = require('../controllers/postController');

router.post('/getAllPosts', verifyToken, post_controller.getAllPosts);
router.post('/getMyPosts', verifyToken, post_controller.getMyPosts);
router.post('/like', verifyToken, post_controller.like);
router.post('/submit', verifyToken, post_controller.submit);
router.post('/getComment', verifyToken, post_controller.getComment);
router.post('/submitComment', verifyToken, post_controller.submitComment);


module.exports = router;