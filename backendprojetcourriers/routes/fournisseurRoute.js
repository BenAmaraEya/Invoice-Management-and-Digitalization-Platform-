const express = require('express');
const router = express.Router();
const FournisseurController = require('../controller/fournisseurController');


//route get fournisseur par son identifiant
router.get('/:id',FournisseurController.getfournisseurbyid);

// Route ajout fournisseur
router.post('/addfournisseur',FournisseurController.addfournisseur);

// Route mettre a jour fournisseur
router.put('/:id',FournisseurController.updatefournisseur)

router.delete('/:id',FournisseurController.deletefournisseur);
module.exports = router;