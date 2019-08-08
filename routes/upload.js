var express = require('express');
var router = express.Router();
var verifyToken = require('../../share/auth/verifyToken');
var multer = require('multer');
var config = require('./../../share/config');
var uploadController = require('../controllers/uploadController');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.imagePath);
    },
    filename: (req, file, cb) => {
        console.log(file);
        var filetype = '';
        if (file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({
    storage: storage
});

router.post('/', verifyToken, upload.single('file'), function (req, res, next) {
    if (!req.file) {
        res.status(500);
        return next(err);
    }
    res.json({
        fileUrl: config.imagePath + '/' + req.file.filename
    });
});

router.post('/saveimage',verifyToken, uploadController.saveimage);
router.post('/updateimage',verifyToken, uploadController.updateimage);
router.post('/isexistimage',verifyToken, uploadController.isexistimage);
router.get('/profileimage', uploadController.profileimage);

module.exports = router;