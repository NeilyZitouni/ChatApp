const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/auth');

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/logout').post(logout);

module.exports = router;
