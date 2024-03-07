const { spawn } = require('child_process');
const fs = require('fs');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const Facture = require('../models/Facture');
const pdfPoppler = require('pdf-poppler');
const Bordereau =require('../models/Bordereau');
const authorizeSupplier = authenticateToken(['fournisseur']);
// Multer setup for file uploading
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // specify the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // use the original file name
  }
});

const upload = multer({ storage: storage }).single('factureFile');

const factureController = {
  upload: [authorizeSupplier,async (req, res) => {
    upload(req, res, err => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading file', error: err });
      }
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      console.log(req.file); // Check if req.file is populated
      console.log(req.file.originalname);
      // Convert PDF to images
      const pdfFilePath = req.file.path;
      const outputImagePath = './uploads/';
      pdfPoppler.convert(pdfFilePath, { format: 'png', out_dir: outputImagePath, prefix: 'uploads' })
        .then(() => {
          // Perform OCR using Tesseract.js on the first page of the PDF
          Tesseract.recognize(`${outputImagePath}uploads-1.png`, 'fra', {
            logger: m => console.log(m)
          }).then(({ data: { text } }) => {
            // Extracting necessary information from OCR text
            const extractedInfo = extractInfoFromOCR(text);
            
            // Send the extracted information back to the client for validation
            res.json({ success: true, extractedInfo });
          }).catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Error performing OCR', error: err });
          });
        }).catch(err => {
          console.error(err);
          res.status(500).json({ message: 'Error converting PDF to image', error: err });
        });
        
        
    });
  }],


  save: [authorizeSupplier,async (req, res) => {
    const { factname, devise, nature, objet, num_po, datereception, num_fact, montant, date_fact,pathpdf } = req.body;
    const iderp = req.params.iderp;

    try {
        console.log('Received request to save facture:', req.body);

        // Create the facture
        const facture = await Facture.create({
            iderp,
            factname,
            devise,
            nature,
            objet,
            num_po,
            datereception,
            num_fact,
            date_fact,
            montant,
            pathpdf
        });

        // Find or create the associated bordereau
        const [bordereau, created] = await Bordereau.findOrCreate({
          where: { nature },
          defaults: { date: new Date() }
      });
        // Associate the facture with the bordereau
        await facture.setBordereau(bordereau);

        const { idF } = facture;
        res.json({ success: true, facture: { ...facture.toJSON(), idF } });
        console.log('Facture saved successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving facture', error: error });
    }
}],


  displayFacture: [authorizeSupplier,async (req, res) => {
    try {
      const { id } = req.params;
      const facture = await Facture.findByPk(id);

      if (!facture) {
        return res.status(404).json({ message: 'Facture not found' });
      }

      // Return the facture object with its pathpdf
      res.json({ success: true, facture });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error displaying facture', error: error });
    }
  }],

  deleteFacture:[authorizeSupplier, async (req, res) => {
    try {
        const { fournisseurId, factureId } = req.params;
        const facture = await Facture.findOne({ where: { idF: factureId, iderp: fournisseurId } });

        if (!facture) {
            return res.status(404).json({ message: 'Facture not found for this Fournisseur' });
        }

        // Vérifiez si le chemin du fichier PDF est stocké dans la base de données
        if (!facture.pathpdf) {
            return res.status(400).json({ message: 'No PDF file associated with this facture' });
        }

        // Supprimez le fichier PDF du système de fichiers en utilisant le chemin réel
        fs.unlinkSync(facture.pathpdf);

        // Supprimez la facture de la base de données
        await facture.destroy();

        res.json({ success: true, message: 'Facture deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting facture', error: error });
    }
}],


  getFactureById: async (req, res) => {
    try {
      const { id } = req.params;
      const facture = await Facture.findById(id);

      if (!facture) {
        return res.status(404).json({ message: 'Facture not found' });
      }

      res.json({ success: true, facture });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching facture by ID', error: error });
    }
  },
   
  getFactureBySupplierId: async (req, res) => {
    try {
        const { iderp } = req.params;
        const factures = await Facture.findAll({ where: { iderp } });

        if (!factures || factures.length === 0) {
            return res.status(404).json({ message: 'No factures found for the supplier ID' });
        }

        res.json({ success: true, factures });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching factures by supplier ID', error: error });
    }
}

};
// Function to extract information from OCR text
function extractInfoFromOCR(text) {
    // Regular expressions for extracting specific information from the OCR text
    const num_factRegex = /Numéro\s*de\s*facture\s*(\d+)/i;
    const dateFactRegex = /(?:Date\s*:\s*|Date\s*de\s*facture\s*:\s*)(\w+)/i;
    const montantRegex = /(?:Montant\s*Total\s*TTC\s*|Montant\s*:\s*)(\d+(\.\d{1,2})?)/i;
    // Add more regular expressions for other details as needed
  
    // Extracting information using regular expressions
    const num_factMatch = text.match(num_factRegex);
    const dateFactMatch = text.match(dateFactRegex);
    const montantMatch = text.match(montantRegex);
    // Extract more details using additional regular expressions
  
    // Check if matches are found and extract the values
    const num_fact = num_factMatch ? num_factMatch[1] : null;
    const date_fact= dateFactMatch ? dateFactMatch[1] : null;
    const montant= montantMatch ? parseFloat(montantMatch[1]) : null
    // Extract more details similarly
    console.log(text);
    return { num_fact, date_fact, montant };
    

  }

module.exports = factureController;