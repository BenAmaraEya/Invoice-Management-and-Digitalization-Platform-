const Facture = require('../models/Facture');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const { Facture } = require('../models');
const { createWorker } = require('tesseract.js');
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
const FactureControlleur={

upload:async (req, res, next) => {
    multer({ 
        storage: storage,
        limits: {
          fileSize: 500 * 1024 * 1024 // Limite de 500 Mo
        },
        fileFilter: function (req, file, cb) {
          if (mime.lookup(file.originalname) === 'application/pdf') {
            cb(null, true);
          } else {
            cb(new Error('Seuls les fichiers PDF sont autorisés'));
          }
        }
      }).single('file');
}
}