const { spawn } = require('child_process');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const Facture = require('../models/Facture');
const pdfPoppler = require('pdf-poppler');

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
  upload: async (req, res) => {
    upload(req, res, err => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading file', error: err });
      }
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

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
  },

  /*save: async (req, res) => {
    // Assuming the user has confirmed the extracted information
    const { num_fact, date_fact, montant, factname, devise, nature, objet } = req.body;

    try {
        // Save the extracted information to the database
        const facture = await Facture.create({
            num_fact,
            date_fact,
            montant,
            factname,
            devise,
            nature,
            objet,
            //pathpdf: req.file.path,
            // Add other fields as necessary
        });

        // Send a success response
        console.log('Facture data added successfully.');
        res.json({ success: true, facture });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving extracted information', error: error });
    }
}*/

save: async (req, res) => {
    const { factname, devise, nature, objet, num_po, datereception } = req.body;
    const iderp = req.params.iderp;
    try {
      const facture = await Facture.create({
        iderp,
        //factname: req.file.originalname,
        //pathpdf: `uploads/${req.file.originalname}`,
        ...req.body,
      });

      res.json({ success: true, facture });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error saving extracted information', error: error });
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