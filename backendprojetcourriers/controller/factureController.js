const { spawn } = require('child_process');
const fs = require('fs');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const Facture = require('../models/Facture');
const pdfPoppler = require('pdf-poppler');
const Bordereau =require('../models/Bordereau');
const Pieces_jointe = require('../models/PiecesJointe');
const { authenticateToken } = require('../utils/jwt');
authorizeSupplier = authenticateToken(['fournisseur','bof']);
const Excel = require('exceljs');
require('../AutoBordereaux');
const path = require('path');
const { where } = require('sequelize');
const { Sequelize } = require('sequelize');



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
  upload:[authorizeSupplier, async (req, res) => {
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
  },],


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
          where: { nature, date: datereception },
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
        if (!facture.pathpdf) {
            fs.unlinkSync(facture.pathpdf);
           
        }
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
      const { idF } = req.params;
      const facture = await Facture.findOne({ where: { idF: idF }, include: { model: Pieces_jointe, as: 'Pieces_jointes' } });

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
      // Récupérer les données des factures de fournisseur
      const {iderp}=req.params;
      const factures = await Facture.findAll({where:{ iderp } }); // Change this line
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
},
viewFacturePDF: async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);

   
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error viewing facture PDF:', error);
    res.status(500).json({ message: 'Error viewing facture PDF', error: error });
  }
},
 updateFacture : async (req, res) => {
  try {
    const { idF } = req.params;
    const facture = await Facture.findOne({ where: { idF } });
    if (!facture) {
      return res.status(404).json({ message: 'Facture not found' });
    }
    const { pathpdf: newFilePath, ...factureData } = req.body; 
    if (facture.status === 'Attente') {
        const oldFilePath = facture.pathpdf; 
      // Mettre à jour les autres données de la facture
      await Facture.update({ pathpdf: newFilePath, ...factureData }, { where: { idF } }); 
      if (newFilePath !== oldFilePath) {
        fs.unlinkSync(oldFilePath); // Supprimez l'ancien fichier PDF
      }
}
    res.json({ message: 'Facture updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},
statfacture: async (req, res) => {
  try {
    // Query the database to get the required statistics
    const nbFactureParType = await Facture.count(); // Count all factures
    const nbFactureRecuHier = await Facture.count({ 
      where: { 
        createdAt: { 
          [Sequelize.Op.gte]: new Date(new Date().setDate(new Date().getDate() - 1)) 
        } 
      } 
    }); // Count factures received in the last 24 hours
    // Adjust the following query based on your data model
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const nbFactureMoisEnCours = await Facture.count({ 
      where: { 
        createdAt: { 
          [Sequelize.Op.gte]: startOfMonth 
        } 
      } 
    }); // Count factures created in the current month
    // Send the statistics as JSON response
    res.json({
      nbFactureParType,
      nbFactureRecuHier,
      nbFactureMoisEnCours
    });
  } catch (error) {
    console.error('Error fetching facture stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},
validerDocument: async (req,res) =>{
  try{
const {idF} = req.params;
const facture = await Facture.findByPk(idF);
if(!facture){
  return res.status(404).json({ message: 'Facture not found' });
}
if(facture.status== 'Attente'){
  const date = new Date();
  const jour = date.getDate().toString().padStart(2, '0'); // Obtient le jour du mois avec padding
  const mois = (date.getMonth() + 1).toString().padStart(2, '0'); // Obtient le mois (janvier est 0) avec padding
  const annee = date.getFullYear(); // Obtient l'année

  const dateVerifi= `${jour}/${mois}/${annee}`;
  const validStatut = `courrier validé par BOF, date de vérification : ${dateVerifi}`;
await Facture.update({ status: validStatut,}, { where: { idF } });
}
else {
  console.log("Le courrier a déjà été examiné.")
}
} catch(error){
  res.status(500).json({ message: 'Internal server error' });
}
},
validerFiscalité: async (req,res) =>{
  try{
  const {idF} = req.params;
  const facture = await Facture.findByPk(idF);
  if(!facture){
    return res.status(404).json({ message: 'Facture not found' });}
    const date = new Date();
    const jour = date.getDate().toString().padStart(2, '0'); // Obtient le jour du mois avec padding
    const mois = (date.getMonth() + 1).toString().padStart(2, '0'); // Obtient le mois (janvier est 0) avec padding
    const annee = date.getFullYear(); // Obtient l'année
  
    const dateVerifi = `${jour}/${mois}/${annee}`;
  const validStatut = `courrier validé par Personnel fiscalité, date de vérification : ${dateVerifi}`;
  await Facture.update({ status: validStatut,}, { where: { idF } });
} catch(error){
  res.status(500).json({ message: 'Internal server error' });
}
  },
validerBudget: async (req,res) =>{
  try{
    const {idF} = req.params;
    const facture = await Facture.findByPk(idF);
    if(!facture){
      return res.status(404).json({ message: 'Facture not found' });}
      const date = new Date();
      const jour = date.getDate().toString().padStart(2, '0'); // Obtient le jour du mois avec padding
      const mois = (date.getMonth() + 1).toString().padStart(2, '0'); // Obtient le mois (janvier est 0) avec padding
      const annee = date.getFullYear(); // Obtient l'année
    
      const dateVerifi = `${jour}/${mois}/${annee}`;
    const validStatut = `courrier validé par Agent Trésorerie, date de vérification : ${dateVerifi}`;
    await Facture.update({ status: validStatut,}, { where: { idF } });
  } catch(error){
    res.status(500).json({ message: 'Internal server error' });
  }
    },
rejeterCourriers : async (req,res) =>{
  try{
  const {idF} = req.params;
  const facture = await Facture.findByPk(idF);
  if(!facture){
    return res.status(404).json({ message: 'Facture not found' });}
    const {motifRejete} = req.body; 
    const date = new Date();
    const jour = date.getDate().toString().padStart(2, '0'); // Obtient le jour du mois avec padding
    const mois = (date.getMonth() + 1).toString().padStart(2, '0'); // Obtient le mois (janvier est 0) avec padding
    const annee = date.getFullYear(); // Obtient l'année
    const dateVerifi = `${jour}/${mois}/${annee}`;
    const motifRejeteAvecDate = `${motifRejete}, date de vérification : ${dateVerifi}`;
    await Facture.update({ status: motifRejeteAvecDate}, { where: { idF } });
  }
 catch(error){
  res.status(500).json({ message: 'Internal server error' });
}
}
};
// Function to extract information from OCR text
function extractInfoFromOCR(text) {
    // Regular expressions for extracting specific information from the OCR text
    const num_factRegex = /Numéro\s*de\s*facture\s*(\d+)/i;
    const dateFactRegex = /(?:Date\s*:\s*|Date\s*de\s*facture\s*:\s*)(\w+)/i;
    const montantRegex = /(?:Montant\s*Total\s*TTC\s*|Montant\s*:\s*)(\d+(\.\d{1,2})?)/i;
  
    // Extracting information using regular expressions
    const num_factMatch = text.match(num_factRegex);
    const dateFactMatch = text.match(dateFactRegex);
    const montantMatch = text.match(montantRegex);
  
    // Check if matches are found and extract the values
    const num_fact = num_factMatch ? num_factMatch[1] : null;
    const date_fact= dateFactMatch ? dateFactMatch[1] : null;
    const montant= montantMatch ? parseFloat(montantMatch[1]) : null
    // Extract more details similarly
    console.log(text);
    return { num_fact, date_fact, montant };
    
  }

module.exports = factureController;