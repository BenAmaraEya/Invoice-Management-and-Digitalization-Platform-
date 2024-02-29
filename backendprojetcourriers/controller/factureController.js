const multer = require('multer');
const mime = require('mime-types');
const { createWorker } = require('tesseract.js');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: 'uploads/', 
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});

const uploadMiddleware = multer({ 
    storage: storage,
    limits: {
      fileSize: 500 * 1024 * 1024 // Limit 500 MB
    },
    fileFilter: function (req, file, cb) {
      if (mime.lookup(file.originalname) === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Seuls les fichiers PDF sont autorisés'));
      }
    }
}).single('file');

const FactureController = {
  upload: async (req, res, next) => {
    uploadMiddleware(req, res, function (err) {
      if (err) {
        let status = 500;
        let message = 'Une erreur inconnue s\'est produite.';
        if (err instanceof multer.MulterError) {
          status = 400;
          message = 'Une erreur s\'est produite lors du téléchargement du fichier.';
        }
        return res.status(status).json({ message });
      }
      res.status(200).json({ message: 'Fichier téléchargé avec succès.' });
    });
  }
};

module.exports = FactureController;
