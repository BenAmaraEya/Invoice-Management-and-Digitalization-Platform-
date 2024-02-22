const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');

router.get('/',UserController.getUser);
router.get('/:id',UserController.getUserById);
// Route ajout utilisateur
router.post('/adduser',UserController.adduser);
// Route mettre a jour utilisateur
router.put('/update/:id',UserController.updateUser);
//router.post('/logout',UserController.logout);
// Route supprime utilisateur
//router.delete('/:id',UserController.deleteUser);
//router.post('/acces/:id',UserController.access);

module.exports = router;