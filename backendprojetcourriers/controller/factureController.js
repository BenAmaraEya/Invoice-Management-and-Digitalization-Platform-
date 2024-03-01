const multer = require('multer');
const mime = require('mime-types');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const Facture = require('../models/Facture');
const pdfPoppler = require('pdf-poppler');

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
    // Implémentez votre logique d'extraction de champs du texte reconnu ici
    // Par exemple :
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

                // Convert PDF to images
                const options = {
                    format: 'jpeg',
                    out_dir: 'uploads'
                };
                try {
                    const images = await pdfPoppler.convert(pdfPath, options);
                    console.log('Images:', images.length);

                    // Récupérer les chemins des images converties
                    const imagePaths = Object.keys(images).map(key => images[key]);

                    // Vérifier si des images ont été converties
                    if (imagePaths.length > 0) {
                        console.log('Images:', imagePaths);

                        // Reconnaître le texte de chaque image
                        const recognizedTexts = await Promise.all(imagePaths.map(image => recognizeText(image)));
                        const extractedText = recognizedTexts.join(' ');

                        console.log('Extracted text:', extractedText);

                        // Extraire les champs du texte reconnu
                        const extractedFields = await extractFieldsFromText(extractedText);

                        // Créer une nouvelle instance de Facture avec les données extraites
                        const newFacture = await Facture.create({
                            num_fact: extractedFields.num_fact,
                            date_fact: extractedFields.date_fact ? new Date(extractedFields.date_fact) : null,
                            montant: extractedFields.montant,
                            factname: "facture1",
                            devise: "TND",
                            nature: "aa",
                            objet: "pc",
                            pathpdf: req.file.path // Chemin vers le fichier PDF téléchargé
                        });

                        res.status(200).json({ message: 'Fichier téléchargé avec succès.' });
                    } else {
                        console.error('Aucune image extraite du PDF.');
                        return res.status(500).json({ error: 'Aucune image extraite du PDF' });
                    }
                } catch (conversionError) {
                    console.error('Error converting PDF to images:', conversionError);
                    return res.status(500).json({ error: 'Erreur lors de la conversion du PDF en images', message: conversionError.message });
                }
            });
        } catch (error) {
            console.error('Erreur:', error);
            return res.status(500).json({ error: 'Erreur lors du traitement du fichier', message: error.message });
        }
    }
};

module.exports = FactureController;
