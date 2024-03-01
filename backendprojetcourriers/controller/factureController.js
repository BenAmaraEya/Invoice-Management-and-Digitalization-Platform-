const multer = require('multer');
const mime = require('mime-types');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const Facture = require('../models/Facture');
const pdf2img = require('pdf2img');

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
        const { data: { text } } = await Tesseract.recognize(imagePath, 'fr');
        console.log('Recognized text:', text);
        return text;
    } catch (error) {
        console.error('Error recognizing text:', error);
        throw error;
    }
}

async function extractFieldsFromText(text) {
    // Implement your logic to extract fields from the recognized text here
    // For example:
    const numFactRegex = /(?:Num(?:\.|éro)?(?:\s+|°\s*))(?:de\s*)?facture\s*:\s*(\w+)/i;
    const dateFactRegex = /(?:Date\s*:\s*|Date\s*de\s*facture\s*:\s*)(\w+)/i;
    const montantRegex = /(?:Montant\s*Total\s*TTC\s*:\s*|Montant\s*:\s*)(\d+(\.\d{1,2})?)/i;
   
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
                console.log(pdfPath);

                // Convert PDF to images
                const options = {
                    type: 'jpg',                     // output type
                    size: 1024,                      // output size
                    density: 600,                    // output dpi
                    outputdir: 'uploads',            // output folder
                    outputname: 'facture_',          // output file name
                    page: null                       // convert all pages
                };

                // Convert PDF to images and handle errors
                const imagePaths = await pdf2img.convert(pdfPath, options).catch(error => {
                    console.error('Error converting PDF to images:', error);
                    throw new Error('Erreur lors de la conversion du PDF en images');
                });

                if (!imagePaths || imagePaths.length === 0) {
                    throw new Error('Aucune image générée lors de la conversion du PDF');
                }

                // Recognize text from each image
                const recognizedTexts = await Promise.all(imagePaths.map(imagePath => recognizeText(imagePath)));
                const extractedText = recognizedTexts.join(' ');

                console.log('Extracted text:', extractedText);

                // Extract fields from the recognized text
                const extractedFields = await extractFieldsFromText(extractedText);

                // Create a new instance of Facture with the extracted data
                const newFacture = await Facture.create({
                    num_fact: extractedFields.num_fact,
                    date_fact: extractedFields.date_fact ? new Date(extractedFields.date_fact) : null,
                    montant: extractedFields.montant,
                    factname: "facture1",
                    devise: "TND",
                    nature: "aa",
                    objet: "pc",
                    pathpdf: req.file.path // Path to the uploaded PDF file
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
