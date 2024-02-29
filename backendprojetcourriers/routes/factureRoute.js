const express =require('express');
const router =express.Router();
const factureController= require('../controller/factureController');


router.post('/upload',factureController.upload);
module.exports=router;