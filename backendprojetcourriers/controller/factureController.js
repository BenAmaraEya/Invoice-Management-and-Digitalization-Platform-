const { spawn } = require('child_process');
const fs = require('fs');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const Facture = require('../models/Facture');
const pdfPoppler = require('pdf-poppler');
const Bordereau =require('../models/Bordereau');
const Pieces_jointe = require('../models/PiecesJointe');
const { authenticateToken } = require('../utils/jwt');
authorizeSupplier = authenticateToken(['fournisseur']);
authorizePersonnelbof = authenticateToken(['bof']);
authorizePersonnelFiscaliste = authenticateToken(['personnelfiscalite']);
authorizeAgent = authenticateToken(['agentTresorerie']);
authorizePersonnel = authenticateToken(['personnelfiscalite','bof','agentTresorerie']);
authorize = authenticateToken(['fournisseur','bof']);
const Excel = require('exceljs');
require('../AutoBordereaux');
const path = require('path');
const { where } = require('sequelize');
const { Sequelize } = require('sequelize');



// définit la configuration de Multer pour le téléchargement de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // specifier la destination de fichier et comment doit etre nommé
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // utilise le nom original de fichier 
  }
});
//creation d'instance multer 
const upload = multer({ storage: storage }).single('factureFile');


const generateExcel = async (factures) => {
  // Création d'un nouveau classeur Excel
  const workbook = new Excel.Workbook();
  // Ajout d'une feuille de calcul au classeur avec le nom 'Factures'
  const worksheet = workbook.addWorksheet('Factures');
  // Définition des en-têtes pour le fichier Excel
  worksheet.columns = [
    { header: 'Facture ID', key: 'idF', width: 10 },
    { header: 'Numéro Facture', key: 'num_fact', width: 20 },
    { header: 'Facture Name', key: 'factname', width: 30 },
    { header: 'Montant', key: 'montant', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Numéro PO', key: 'num_po', width: 20 },
    { header: 'Date Facture', key: 'date_fact', width: 20 }
    
  ];

  // Ajout des données au fichier Excel
  factures.forEach((facture) => {
    worksheet.addRow({
      idF: facture.idF,
      num_fact: facture.num_fact,
      factname: facture.factname,
      montant: facture.montant,
      status: facture.status,
      num_po: facture.num_po,
      date_fact: facture.date_fact
      
    });
  });

  // Génération du tampon (buffer) du fichier Excel
  const buffer = await workbook.xlsx.writeBuffer();

  return buffer;
};
const factureController = {
  upload:[authorize, async (req, res) => {
    //appel de l'upload qui est linstance de multer 
    upload(req, res, err => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading file', error: err });
      }
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      console.log(req.file); 
      console.log(req.file.originalname);
      // Convertir pdf en image
      const pdfFilePath = req.file.path;
      const outputImagePath = './uploads/';
      pdfPoppler.convert(pdfFilePath, { format: 'png', out_dir: outputImagePath, prefix: 'uploads' })
        .then(() => {
          // 
          Tesseract.recognize(`${outputImagePath}uploads-1.png`, 'fra', {
            logger: m => console.log(m)
          }).then(({ data: { text } }) => {
            // Extraire les information necessaire de l'ORC
            const extractedInfo = extractInfoFromOCR(text);
            
            //renvoir les information au client pour leur validation
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


  save: [authorize,async (req, res) => {
    const { factname, devise, nature, objet, num_po, datereception, num_fact, montant, date_fact,pathpdf } = req.body;
    const iderp = req.params.iderp;

    try {
        console.log('Received request to save facture:', req.body);

        // Créer une facture
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

         //trouver ou crée un bordereau associé
         const [bordereau, created] = await Bordereau.findOrCreate({
          where: { nature, date: datereception },
      });
        // Associer la facture avec un bordereau
        await facture.setBordereau(bordereau);

        const { idF } = facture;
        res.json({ success: true, facture: { ...facture.toJSON(), idF } });
        console.log('Facture saved successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving facture', error: error });
    }
}],


 /* displayFacture: [authorizeSupplier,async (req, res) => {
    try {
      const { id } = req.params;
      const facture = await Facture.findByPk(id);

      if (!facture) {
        return res.status(404).json({ message: 'Facture not found' });
      }
      res.json({ success: true, facture });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error displaying facture', error: error });
    }
  }],*/

  deleteFacture:[authorize,async (req, res) => {
    try {
        const { fournisseurId, factureId } = req.params;
        const facture = await Facture.findOne({ where: { idF: factureId, iderp: fournisseurId } });
        if (!facture) {
            return res.status(404).json({ message: 'Facture not found for this Fournisseur' });
        } 
        if (facture.pathpdf) {
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
      
      const factures = req.body.factures; 

      
      const excelBuffer = await generateExcel(factures);

   
      res.status(200)
          .attachment('factures.xlsx')
          .send(excelBuffer);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error generating Excel file', error: error });
  }
}],


getFacturesCountByStatus: async (req, res) => {
  try {
      // Récupérer les données des factures de fournisseur
      const {iderp}=req.params;
      const factures = await Facture.findAll({where:{ iderp } }); 
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
 updateFacture :[authorize, async (req, res) => {
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
}],
statfacture: async (req, res) => {
  try {
    // Interroger la base de données pour obtenir les statistiques requises
    const nbFactureParType = await Facture.count(); 
    // Compter toutes les factures
    const nbFactureRecuHier = await Facture.count({ 
      where: { 
        createdAt: { 
          [Sequelize.Op.gte]: new Date(new Date().setDate(new Date().getDate() - 1)) 
        } 
      } 
    }); // Compter les factures reçues au cours des dernières 24 heures
    // Ajuster la requête suivante en fonction de votre modèle de données
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const nbFactureMoisEnCours = await Facture.count({ 
      where: { 
        createdAt: { 
          [Sequelize.Op.gte]: startOfMonth 
        } 
      } 
    }); // Compter les factures créées dans le mois en cours
    // Envoyer les statistiques en tant que réponse JSON
    res.json({
      nbFactureParType,
      nbFactureRecuHier,
      nbFactureMoisEnCours
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques de facturation:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}
,
validerDocument:[authorizePersonnelbof, async (req,res) =>{
  try{
const {idF} = req.params;
const facture = await Facture.findByPk(idF);
if(!facture){
  return res.status(404).json({ message: 'Facture not found' });
}
if(facture.status== 'Attente'){
  const date = new Date();//a modifier
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
}],
validerFiscalité:[authorizePersonnelFiscaliste, async (req,res) =>{
  try{
  const {idF} = req.params;
  const facture = await Facture.findByPk(idF);
  if(!facture){
    return res.status(404).json({ message: 'Facture not found' });}
    const date = new Date();
    const jour = date.getDate().toString().padStart(2, '0'); 
    const mois = (date.getMonth() + 1).toString().padStart(2, '0'); // Obtient le mois (janvier est 0) avec padding
    const annee = date.getFullYear(); 
  
    const dateVerifi = `${jour}/${mois}/${annee}`;
  const validStatut = `courrier validé par Personnel fiscalité, date de vérification : ${dateVerifi}`;
  await Facture.update({ status: validStatut,}, { where: { idF } });
} catch(error){
  res.status(500).json({ message: 'Internal server error' });
}
  }],
validerBudget:[authorizeAgent,async (req,res) =>{
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
    }],
 rejeterCourriers : [authorizePersonnel,async (req, res) => {
      try {
        const { idF } = req.params;
        const { motifRejete } = req.body;
        // Find the facture by its ID
        const facture = await Facture.findByPk(idF);
        // If the facture is not found, return a 404 error
        if (!facture) {
          return res.status(404).json({ message: 'Facture not found' });
        }
    
        // Update the facture status with the rejection motif and verification date
        const date = new Date();
        const jour = date.getDate().toString().padStart(2, '0');
        const mois = (date.getMonth() + 1).toString().padStart(2, '0');
        const annee = date.getFullYear();
        const dateVerifi = `${jour}/${mois}/${annee}`;
        const motifRejeteAvecDate = `${motifRejete}, date de vérification : ${dateVerifi}`;
        await facture.update({ status: motifRejeteAvecDate });
        // Return a success message
        res.json({ message: 'Facture status updated successfully' });
      } catch (error) {
        // If an error occurs, return a 500 internal server error
        console.error('Error in rejeterCourriers:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }],
rechercheParNumFact: async (req, res) => {
      try {
          const { num_fact } = req.query; 
          const factures = await Facture.findOne({
              where: {
                num_fact: num_fact
              },
              include: { model: Pieces_jointe, as: 'Pieces_jointes' }
          });
          console.log(factures);
          res.json(factures);
      } catch (error) {
          console.error(error);
          res.status(500).send('Erreur de serveur');
      }
  },
recherchePardate: async (req, res) => {
    try {
        const { dateReception } = req.query; 
        const factures = await Facture.findAll({
            where: {
              datereception: dateReception
            },
            include: { model: Pieces_jointe, as: 'Pieces_jointes' }
        });
        console.log(factures);
        res.json(factures);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur de serveur');
    }
},
    
};
// Fonction pour extraire les information de l'ORC
function extractInfoFromOCR(text) {
    
    const num_factRegex = /(?:N°\s*facture|Numéro\s*facture|Facture\s*N°)\s*(\d+)/i;
    const dateFactRegex = /(?:Date\s*:\s*|Date\s*de\s*facture\s*:\s*)(\w+)/i;
    const montantRegex = /(?:Montant\s*Total\s*TTC\s*|Montant\s*:\s*)(\d+(\.\d{1,2})?)/i;
  
    
    const num_factMatch = text.match(num_factRegex);
    const dateFactMatch = text.match(dateFactRegex);
    const montantMatch = text.match(montantRegex);
  
   
    const num_fact = num_factMatch ? num_factMatch[1] : null;
    const date_fact= dateFactMatch ? dateFactMatch[1] : null;
    const montant= montantMatch ? parseFloat(montantMatch[1]) : null
   
    console.log(text);
    return { num_fact, date_fact, montant };
    
  }

module.exports = factureController;