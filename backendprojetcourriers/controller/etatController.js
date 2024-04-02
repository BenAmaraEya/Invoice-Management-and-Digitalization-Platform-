const Facture = require('../models/Facture');
const Etat = require('../models/Etat');
const etatController ={
    add: async (req,res) =>{
        try {
            const { etat } = req.body;  
              const idF = req.params.idF;
            
            const facture = await Facture.findOne({ where: { idF: idF } });
            if (!facture) {
              return res.status(404).json({ error: 'facture non trouvé' });
            }
               
            const etats = await Etat.create({ etat, idF: idF, date: new Date });
            res.status(201).json(etats);
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
module.exports = etatController;