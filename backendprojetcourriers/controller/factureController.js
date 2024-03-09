const { spawn } = require('child_process');
const fs = require('fs');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const Facture = require('../models/Facture');
const pdfPoppler = require('pdf-poppler');
const Bordereau =require('../models/Bordereau');
const { authenticateToken } = require('../utils/jwt');
authorizeSupplier = authenticateToken(['fournisseur']);
const Excel = require('exceljs');
require('../AutoBordereaux');


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
const generateExcel = async (factures) => {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Factures');

  // Define headers for the Excel file
  worksheet.columns = [
      { header: 'Facture ID', key: 'idF', width: 10 },
      { header: 'Numéro Facture', key: 'num_fact', width: 20 },
      { header: 'Facture Name', key: 'factname', width: 30 },
      { header: 'Montant', key: 'montant', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Numéro PO', key: 'num_po', width: 20 },
      { header: 'Date Facture', key: 'date_fact', width: 20 }
      // Add more headers as needed
  ];

  // Add data to the Excel file
  factures.forEach((facture) => {
      worksheet.addRow({
          idF: facture.idF,
          num_fact: facture.num_fact,
          factname: facture.factname,
          montant: facture.montant,
          status: facture.status,
          num_po: facture.num_po,
          date_fact: facture.date_fact
          // Add more data fields as needed
      });
  });

  // Generate the Excel file buffer
  const buffer = await workbook.xlsx.writeBuffer();

  return buffer;
};
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

         //Find or create the associated bordereau
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

  deleteFacture:[authorizeSupplier,async (req, res) => {
    try {
        const { fournisseurId, factureId } = req.params;
        const facture = await Facture.findOne({ where: { idF: factureId, iderp: fournisseurId } });

        if (!facture) {
            return res.status(404).json({ message: 'Facture not found for this Fournisseur' });
        }

        // Vérifiez si le chemin du fichier PDF est stocké dans la base de données
       /* if (facture.pathpdf) {
            fs.unlinkSync(facture.pathpdf);
           
        }*/

       
      

        // Supprimez la facture de la base de données
        await facture.destroy();

        res.json({ success: true, message: 'Facture deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting facture', error: error });
    }
},
  ],

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
},
ExportFacturetoExcel:[authorizeSupplier, async (req, res) => {
  try {
      // Retrieve facture data from the database or request body
      const factures = req.body.factures; // Adjust this according to your implementation

      // Generate the Excel file buffer
      const excelBuffer = await generateExcel(factures);

      // Send the Excel file buffer back to the client
      res.status(200)
          .attachment('factures.xlsx')
          .send(excelBuffer);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error generating Excel file', error: error });
  }
}],
// Contrôleur des factures

getFacturesCountByStatus: async (req, res) => {
  try {
      // Récupérer les données des factures depuis votre base de données
      const factures = await Facture.findAll(); // Change this line
      console.log("Factures found:", factures);
      // Initialiser les compteurs pour chaque catégorie de factures
      let NBFValide = 0;
      let NBFpaye = 0;
      let NBFAttente = 0;
      let NBFrejete = 0;

      // Compter le nombre de factures dans chaque catégorie
      factures.forEach((facture) => {
          switch (facture.status) {
              case 'Validé':
                NBFValide++;
                  break;
              case 'Payé':
                NBFpaye++;
                  break;
              case 'Attente':
                NBFAttente++;
                  break;
              case 'Rejeté':
                NBFrejete++;
                  break;
              default:
                  break;
          }
      });

      // Retourner les nombres de factures dans chaque catégorie
      return res.status(200).json({
        NBFValide,
          NBFpaye,
          NBFAttente,
          NBFrejete
      });
  } catch (error) {
      console.error('Error fetching factures:', error);
      return res.status(500).json({ error: 'Internal server error' });
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