const express = require('express');
const router = express.Router();
const userServiceController = require('../../controllers/serviceController');

router.post('/create', userServiceController.createUser );
router.post('/delete', userServiceController.deleteUserByEmail );
router.post('/verify', userServiceController.loginUser );
router.post('/verifyotp', userServiceController.verifyOtp );
router.post('/get', userServiceController.getUserByEmail );

module.exports = router;