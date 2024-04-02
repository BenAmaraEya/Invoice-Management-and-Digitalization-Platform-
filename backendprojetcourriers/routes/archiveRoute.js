const express = require('express');
const archiveControlleur = require('../controller/archiveControlleur');
const router = express.Router();
router.post('/archiver',archiveControlleur.archiver);

module.exports = router;