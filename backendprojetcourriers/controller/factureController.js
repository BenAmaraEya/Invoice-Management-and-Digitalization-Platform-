const multer = require('multer');
const mime = require('mime-types');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const Facture = require('../models/Facture');
const pdfPoppler = require('pdf-poppler');
const { spawn } = require('child_process');

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

async function recognizeText(imagePath) {
    try {
        const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
        console.log('Recognized text:', text);
        return text;
    } catch (error) {
        console.error('Error recognizing text:', error);
        throw error;
    }
}

async function extractFieldsFromText(text) {
  
    const numFactRegex = /(?:Num(?:\.|éro)?(?:\s+|°\s*))(?:de\s*)?facture\s*(\w+)/i;
    const dateFactRegex = /(?:Date\s*:\s*|Date\s*de\s*facture\s*:\s*)(\w+)/i;
    const montantRegex = /(?:Montant\s*Total\s*TTC\s*|Montant\s*:\s*)(\d+(\.\d{1,2})?)/i;
   
    const numFactMatch = text.match(numFactRegex);
    const dateFactMatch = text.match(dateFactRegex);
    const montantMatch = text.match(montantRegex);

    const extractedFields = {
        num_fact: numFactMatch ? numFactMatch[1] : null,
        date_fact: dateFactMatch ? dateFactMatch[1] : null,
        montant: montantMatch ? parseFloat(montantMatch[1]) : null
    };

    return extractedFields;
}


const FactureController = {
    upload: async (req, res, next) => {
        try {
            uploadMiddleware(req, res, async function (err) {
                if (err) {
                    let status = 500;
                    let message = 'Une erreur inconnue s\'est produite.';
                    if (err instanceof multer.MulterError) {
                        status = 400;
                        message = 'Une erreur s\'est produite lors du téléchargement du fichier.';
                    }
                    return res.status(status).json({ message });
                }
                
                const pdfPath = req.file.path;
                console.log('PDF Path:', pdfPath);

                /* Convert PDF to images
                const options = {
                    format: 'jpeg',
                    out_dir: 'uploads'
                };
                try {
                    const images = await pdfPoppler.convert(pdfPath, options);

                    // Récupérer le chemin de l'image convertie
                    //const imagePath = Object.values(images)[0]; // Prendre le premier élément du tableau
                    
                    // Afficher les chemins des images converties pour vérifier
                    console.log('Image Paths:', images);*/
                   try{
                
                    const outputImagePath = './uploads/';
                    await pdfPoppler.convert(pdfPath, { format: 'png', out_dir: outputImagePath, prefix: 'uploads' });
                    
                    const imagePath = `${outputImagePath}uploads-1.png`;
                    const recognizedText = await recognizeText(imagePath);
                    console.log('Recognized Text:', recognizedText);
                    
                    const extractedFields = await extractFieldsFromText(recognizedText);
                    console.log('Extracted Fields:', extractedFields);
                    
                    res.status(200).json({ message: 'Fichier téléchargé avec succès.' });
                } catch (error) {
                    console.error('Error processing PDF:', error);
                    res.status(500).json({ error: 'Erreur lors du traitement du fichier PDF', message: error.message });
                }
            });
        } catch (error) {
            console.error('Erreur:', error);
            return res.status(500).json({ error: 'Erreur lors du traitement du fichier', message: error.message });
        }
    },
    save: async (req, res) => {
        const { factname, devise, nature, objet, num_po, datereception } = req.body;
    
        try {
          const facture = await Facture.create({
            num_fact:extractedFields.num_fact,
            date_fact: extractedFields.date_fact ? new Date(extractedFields.date_fact) : null,
            montant: extractedFields.montant,
            factname: req.file.originalname,
            pathpdf: req.file.path,
            ...req.body,
          });
    
          res.json({ success: true, facture });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error saving extracted information', error: error });
        }
      }
};



module.exports = FactureController;

