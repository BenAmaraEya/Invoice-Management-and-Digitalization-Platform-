const express = require('express');
const router = express.Router();
const FournisseurController = require('../controller/fournisseurController');


//route get fournisseur par son identifiant
router.get('/:iderp',FournisseurController.getfournisseurbyid);
router.get('/',FournisseurController.getFournisseur);
router.get('/userId/:UserId',FournisseurController.getfournisseurbyuserId);

// Route ajout fournisseur
router.post('/addfournisseur',FournisseurController.addfournisseur);

// Route mettre a jour fournisseur
router.put('/:iderp',FournisseurController.updateFournisseur)

router.delete('/:iderp',FournisseurController.deletefournisseur);
module.exports = router;