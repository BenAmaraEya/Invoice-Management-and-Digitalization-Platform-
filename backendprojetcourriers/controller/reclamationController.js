const Reclamation = require('../models/Reclamation');
const Fournisseur = require('../models/Fournisseur');
reclamationController = {
envoyer: async (req,res) =>{
    try {
        const { contenu } = req.body;  
          const iderp = req.params.iderp;
        
        const fournisseur = await Fournisseur.findOne({ where: { iderp: iderp } });
        if (!fournisseur) {
          return res.status(404).json({ error: 'fournisseur non trouvé' });
        }
           // Création de la réclamation
        const reclamation = await Reclamation.create({ contenu, iderp: iderp });
        res.status(201).json(reclamation);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la création de la Réclamation' });
      }
},
getAll: async (req,res) =>{
try {
    const reclamations = await Reclamation.findAll();
    res.json(reclamations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des Réclamations' });
  }
}
};
module.exports = reclamationController;