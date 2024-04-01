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
},
getrec:async(req,res)=>{try {
  // Query your database or wherever you store reclamations to get the count of new reclamations
  // For simplicity, let's assume you have a Reclamation model and a field 'isNew' to track new reclamations
  const newReclamationsCount = await Reclamation.count({ where: { isNew: true } });

  // Send the count of new reclamations as the response
  res.json({ count: newReclamationsCount });
} catch (error) {
  console.error('Error fetching new reclamations count:', error);
  res.status(500).json({ error: 'Internal server error' });
}
}
};
module.exports = reclamationController;