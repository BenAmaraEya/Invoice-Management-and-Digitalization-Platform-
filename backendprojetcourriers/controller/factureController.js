const multer = require('multer');
const mime = require('mime-types');
const fs = require('fs');
const Facture = require('../models/Facture');
const { createWorker } = require('tesseract.js');

async function extractTextFromPDF(pdfPath) {
    const worker = createWorker();

    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    const { data: { text } } = await worker.recognize(({
        input: { url: pdfPath }, // Chemin vers le fichier PDF
    }));

    await worker.terminate();

    return text;
}


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
        const { factname, devise, nature, objet, num_po, datereception } = req.body;
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
                
                // Extract text from PDF using Tesseract.js
                let extractedText = '';
                try {
                    extractedText = await extractTextFromPDF(pdfPath);
                    // Ensure extractedText is a string
                    if (typeof extractedText !== 'string') {
                        throw new Error('Extracted text is not a string');
                    }
                    console.log(extractedText);
                } catch (error) {
                    console.error('Error extracting text from PDF:', error);
                    return res.status(500).json({ error: 'Erreur lors de l\'extraction du texte du PDF', message: error.message });
                }

                // Extract fields from the recognized text
                const extractedFields = await extractFieldsFromText(extractedText);
                console.log(extractedFields);
                // Create a new instance of Facture with the extracted data
                const newFacture = await Facture.create({
                    num_fact: extractedFields.num_fact,
                    date_fact: extractedFields.date_fact ?new Date(extractedFields.date_fact):null,
                    montant: extractedFields.montant,
                    pathpdf: req.file.path ,// Path to the uploaded PDF file
                    ...req.body,

                });

                res.status(200).json({ message: 'Fichier téléchargé avec succès.' });
            });
        } catch (error) {
            console.error('Erreur:', error);
            return res.status(500).json({ error: 'Erreur lors du traitement du fichier', message: error.message });
        }
    }
};

module.exports = FactureController;
