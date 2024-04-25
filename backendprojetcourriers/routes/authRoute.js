const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');


// Route for user login
router.post('/login', UserController.login);
router.post('/logout/:id',UserController.logout);
module.exports = router;