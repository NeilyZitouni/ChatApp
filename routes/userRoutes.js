const express = require('express');
const router = express.Router();
const { uploadProfilePicture } = require('../controllers/userController');

router.route('/').post(uploadProfilePicture);

module.exports = router;
