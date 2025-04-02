const express = require("express");
const router = express.Router();
const GymController = require('../Controllers/gym');

router.post('/register', GymController.register);
router.post('/login', GymController.login);
router.post('/reset-password/sendOtp', GymController.sendOtp);
router.post('/reset-password/checkOtp', GymController.checkOtp);
router.post('/reset-password', GymController.resetPassword);
router.post('/logout',GymController.logout);
module.exports = router;
