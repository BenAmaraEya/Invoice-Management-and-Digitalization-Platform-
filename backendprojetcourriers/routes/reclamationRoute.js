const express =require('express');
const router =express.Router();
const reclamationController= require('../controller/reclamationController');

router.post('/envoyer/:iderp',reclamationController.envoyer);
router.get('/new/count',reclamationController.getrec);
router.get('/',reclamationController.getAll);
module.exports=router;