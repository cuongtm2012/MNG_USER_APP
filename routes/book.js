var express = require('express');
var router = express.Router();
var verifyToken = require('../../share/auth/verifyToken');
var book_controller = require('../controllers/bookController');

router.post('/bookfacility', verifyToken, book_controller.bookfacility);
router.get('/reservationhistory', verifyToken, book_controller.reservationhistory);
router.get('/reservation', verifyToken, book_controller.reservation);
router.get('/reservationprice', verifyToken, book_controller.reservationprice);
router.get('/reservationToday', verifyToken, book_controller.reservationToday);
router.delete('/cancelbook', verifyToken, book_controller.cancelbook);
module.exports = router;