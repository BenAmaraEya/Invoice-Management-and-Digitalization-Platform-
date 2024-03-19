const express = require('express');
const router = express.Router();
const UserController = require('../controller/userController');

router.get('/',UserController.getUser);
router.get('/:id',UserController.getUserById);
// Route ajout utilisateur
router.post('/adduser',UserController.adduser);
// Route mettre a jour utilisateur
router.put('/update/:id',UserController.updateUser);
// Route supprime utilisateur
router.delete('/delete/:id',UserController.deleteUser);
router.post('/acces/:id',UserController.access);
// route mettre a jour mot passe
router.put('/updatePass/:id',UserController.updatePassword);


module.exports = router;