var express = require('express');
var router = express.Router();
var verifyToken = require('../../share/auth/verifyToken');
var request_controller = require('../controllers/requestController');

router.post('/request', verifyToken, request_controller.request);
router.get('/requestmanagement', verifyToken, request_controller.requestmanagement);
router.delete('/cancleRequest', verifyToken, request_controller.cancleRequest);
router.get('/complaintmanagement', verifyToken, request_controller.complaintmanagement);
router.delete('/cancleComplaint', verifyToken, request_controller.cancleComplaint);
module.exports = router;