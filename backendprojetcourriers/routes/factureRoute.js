const express =require('express');
const router =express.Router();
const factureController= require('../controller/factureController');
const path = require('path');

router.post('/upload',factureController.upload);
router.post('/save/:iderp',factureController.save);
router.get('/:iderp', factureController.getFactureBySupplierId);
router.delete('/fournisseur/:fournisseurId/facture/:factureId',factureController.deleteFacture);
router.post('/export',factureController.ExportFacturetoExcel);
router.get('/facture/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename); 

    res.sendFile(filePath);
});
router.get('/',factureController.getFacturesCountByStatus);
module.exports=router;