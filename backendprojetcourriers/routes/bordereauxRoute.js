const express = require('express');
const bordereauController = require('../controller/bordereauController');
const router = express.Router();

router.get('/',bordereauController.getAllBordereau);

module.exports = router;