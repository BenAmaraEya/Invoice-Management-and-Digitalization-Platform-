const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');
router.get('/',UserController.getUser);
// Route ajout utilisateur
router.post('/adduser',UserController.adduser);
// Route mettre a jour utilisateur
router.put('/update/:id',UserController.updateUser);
// Route supprime utilisateur
router.delete('/:id',UserController.deleteUser);
module.exports = router;