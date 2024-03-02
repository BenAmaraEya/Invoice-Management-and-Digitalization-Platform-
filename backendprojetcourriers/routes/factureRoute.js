const express =require('express');
const router =express.Router();
const factureController= require('../controller/factureController');


router.post('/upload',factureController.upload);
router.post('/save',factureController.save);
module.exports=router;