const express =require('express');
const router =express.Router();
const factureController= require('../controller/factureController');


router.post('/upload',factureController.upload);
router.post('/save/:iderp',factureController.save);
router.get('/:iderp', factureController.getFactureBySupplierId);
router.delete('/fournisseur/:fournisseurId/facture/:factureId',factureController.deleteFacture);
module.exports=router;