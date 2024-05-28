const Facture = require('../models/Facture');
const Etat = require('../models/Etat');
const archiveController = require('../controller/archiveControlleur');
//const generateInfographicImage = require('./../LigneInfographique');
//const nodemailer = require('nodemailer');
const fs = require('fs');
//const Fournisseur = require('../models/Fournisseur');
//const User = require('../models/User');
//const { Sequelize } = require('sequelize');
//const etatgraph = ['Envoye Finance', 'Envoye Fiscalité', 'Paiement', 'Cloture'];

/*const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'eyabenamara288@gmail.com',
    pass: 'pgaw wcnc ymux oeqs'
  }
});*/
const etatController ={
  add: async (req,res) =>{
    try {
        const { etat } = req.body;  
          const idF = req.params.idF;
        
        const facture = await Facture.findOne({ where: { idF: idF }, include:{
          model:Etat
        } });
        if (!facture) {
          return res.status(404).json({ error: 'facture non trouvé' });
        }
        console.log(facture)
      // Vérifier si la facture a déjà cet état
      const existingEtat = facture.Etats.find(item => item.etat === etat);
      if(existingEtat){
          return res.status(400).json({ error: 'La facture est déjà à cet état' });
      }
      //const completionStatus = Array(etatgraph.length).fill(false);
      //completionStatus[index] = true;
      const etats = await Etat.create({ etat, idF: idF, date: new Date});
        
        if (etat === 'cloture') {
          await archiveController.archiver(req, res);
        }
       // sendEmailNotification(facture.idF, etat, completionStatus);
        console.log(`etat facture ${facture.num_fact} add successful`);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création de la Etat' });
      }
},
    getEtatFacture: async (req,res) =>{
    try {
       const idF = req.params.idF;
       const facture = await Facture.findOne({ where: { idF: idF } });

       if (!facture) {
        return res.status(404).json({ error: 'facture non trouvé' });
      }
        const etats = await Etat.findAll({where: {
            idF:idF
        }});
        res.json(etats);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des Etats' });
      }
    }

};
/*const sendEmailNotification = async (factureID, newEtat, completedSteps) => {
  try {
    
     
    const facture = await Facture.findOne({
      where: { idF: factureID },
      include: [{
        model: Fournisseur,
              include: [
                  {
                      model: User,
                      attributes: ['email']
                  }
              ]
          }
      ]
  });
      
      if (!facture) {
        console.error('Facture not found');
        return;
      }
      
      const userEmail = facture.Fournisseur.User.email;
    const imagePath = generateInfographicImage(completedSteps);

    const mailOptions = {
      from: 'eyabenamara288@gmail.com',
      to: userEmail,
      subject: 'Etat Update Notification',
      text: `Dear recipient,\nThe etat for facture ID ${factureID} has been updated. Please see the attached infographic line representing the etat update.\n\nBest regards,\nYour Name`,
      attachments: [{ path: imagePath }]
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }

      fs.unlinkSync(imagePath);
    });
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
};*/
module.exports = etatController;  