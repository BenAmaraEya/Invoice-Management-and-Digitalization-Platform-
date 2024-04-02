
const fs = require('fs');
const path = require('path');
const Facture = require('../models/Facture');
const Etat = require('../models/Etat');
const Archive = require('../models/Archive');
const archiveController ={
    archiver: async (req, res) => {
        try {
          const facturesCloturees = await Facture.findAll({
            include: [{ model: Etat, where: { etat: 'cloture' } }],
          });
    
          for (const facture of facturesCloturees) {
            // Récupérer les états associés à la facture
            const etats = await facture.getEtats();
            for (const etat of etats) {
                const anneeCloture = new Date(etat.date).getFullYear();
              const archiveDir = path.join(__dirname, '..', 'archives', `${anneeCloture}`);
              if (!fs.existsSync(archiveDir)) {
                fs.mkdirSync(archiveDir);
              }
    
              const oldPath = path.join(__dirname, '..', 'uploads', facture.pathpdf);
              const newPath = path.join(archiveDir, `${facture.id}.pdf`);
              fs.renameSync(oldPath, newPath);
    
              await Archive.create({
                annee: anneeCloture,
                path: newPath,
              });
            }
          }
          console.log('Archivage des factures terminé avec succès.');
        } catch (error) {
          console.error('Erreur lors de l\'archivage des factures :', error);
        }
      },


};
module.exports = archiveController;                                                       