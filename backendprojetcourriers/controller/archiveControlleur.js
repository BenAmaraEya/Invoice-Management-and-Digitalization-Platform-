const fs = require('fs');
const path = require('path');
const Facture = require('../models/Facture');
const Etat = require('../models/Etat');
const Archive = require('../models/Archive');

const archiveController = {
  archiver: async (req, res) => {
    try {
      const facturesCloturees = await Facture.findAll({
        include: [{ model: Etat, where: { etat: 'cloture' } }],
      });

      // Créer un objet pour stocker les archives par année de clôture
      const archivesByYear = {};

      for (const facture of facturesCloturees) {
        const etats = await facture.getEtats();
        for (const etat of etats) {
          const anneeCloture = new Date(etat.date).getFullYear();

          // Vérifier si une archive pour cette année existe déjà
          if (!archivesByYear[anneeCloture]) {
            archivesByYear[anneeCloture] = {
              annee: anneeCloture,
              path: path.join(__dirname, '..', 'archives', `${anneeCloture}`),
            };
          }

          const archiveDir = archivesByYear[anneeCloture].path;
          if (!fs.existsSync(archiveDir)) {
            fs.mkdirSync(archiveDir, { recursive: true });
          }

          const oldPath = path.join(__dirname, '..', facture.pathpdf);
          const newPath = path.join(archiveDir, `${facture.id}.pdf`);
          fs.renameSync(oldPath, newPath);
        }
      }

      // Enregistrer les archives dans la base de données
      for (const key in archivesByYear) {
        const archiveData = archivesByYear[key];
        await Archive.create(archiveData, {
          include: [{ model: Facture, as: 'factures' }],
        });
      }

      console.log('Archivage des factures terminé avec succès.');
    } catch (error) {
      console.error('Erreur lors de l\'archivage des factures :', error);
    }
  },
};

module.exports = archiveController;
