const express =require('express');
const router =express.Router();
const factureController= require('../controller/factureController');
const path = require('path');
module.exports = (io) => {
router.post('/upload',factureController.upload);
router.post('/save/:iderp',factureController.save);
router.get('/:iderp', factureController.getFactureBySupplierId);
router.get('/', factureController.getAllFacture);
router.delete('/fournisseur/:fournisseurId/facture/:factureId',factureController.deleteFacture);
router.post('/export',factureController.ExportFacturetoExcel);
router.get('/view-pdf/uploads/:filename', factureController.viewFacturePDF);
router.get('/status/:iderp',factureController.getFacturesCountByStatus);
router.put('/updateFacture/:idF',factureController.updateFacture);
// get facture BY Id
router.get('/facturebyId/:idF',factureController.getFactureById);
router.get('/stat/all',factureController.statfacture);
router.put('/validerCourriers/:idF',factureController.validerDocument);
router.put('/rejeteCourrier/:idF',factureController.rejeterCourriers);
router.put('/validerfiscalite/:idF',factureController.validerFiscalité);
router.put('/validerTresorerie/:idF',factureController.validerBudget);
/*router.get('/recherche/parNumFact',factureController.rechercheParNumFact);
router.get('/recherche/parDateReception',factureController.recherchePardate);*/
router.get('/recherche/ParDATEetNUM',factureController.rechercheFacture);
factureController.setIo(io);

  return router;
}