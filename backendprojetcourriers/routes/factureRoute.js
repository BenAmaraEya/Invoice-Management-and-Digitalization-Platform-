const express =require('express');
const router =express.Router();
const factureController= require('../controller/factureController');
const path = require('path');

router.post('/upload',factureController.upload);
router.post('/save/:iderp',factureController.save);
router.get('/:iderp', factureController.getFactureBySupplierId);
router.delete('/fournisseur/:fournisseurId/facture/:factureId',factureController.deleteFacture);
router.post('/export',factureController.ExportFacturetoExcel);
router.get('/view-pdf/uploads/:filename', factureController.viewFacturePDF);
router.get('/status/:iderp',factureController.getFacturesCountByStatus);
router.put('/updateFacture/:idF',factureController.updateFacture);
router.get('/facturebyId/:idF',factureController.getFactureById);
router.get('/stat/all',factureController.statfacture);
module.exports=router;