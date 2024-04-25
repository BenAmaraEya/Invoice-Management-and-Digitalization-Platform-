const Reclamation = require('../models/Reclamation');
const Fournisseur = require('../models/Fournisseur');

let io; 

const reclamationController = {
  sendNotificationToBOF: (reclamation) => {
    io.emit('newReclamation', reclamation);
  },

  envoyer: async (req, res) => {
    try {
      const { contenu } = req.body;
      const iderp = req.params.iderp;

      const fournisseur = await Fournisseur.findOne({ where: { iderp: iderp } });
      if (!fournisseur) {
        return res.status(404).json({ error: 'fournisseur non trouvé' });
      }

      const reclamation = await Reclamation.create({ contenu, iderp: iderp });
      reclamationController.sendNotificationToBOF(reclamation);
      res.status(201).json(reclamation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la création de la Réclamation' });
    }
  },

  getAll: async (req, res) => {
    try {
      const reclamations = await Reclamation.findAll();
      res.json(reclamations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération des Réclamations' });
    }
  },

  getbyid:async(req,res)=>
  {
    try {
    // Get the reclamation ID from the request parameters
    const { id } = req.params;

    // Find the reclamation by ID in the database
    const reclamation = await Reclamation.findByPk(id);

    // Check if reclamation exists
    if (!reclamation) {
      return res.status(404).json({ error: 'Reclamation not found' });
    }
    reclamation.lue = true;
    await reclamation.save();
    // If reclamation is found, return it as a response
    res.json(reclamation);
  } catch (error) {
    console.error('Error fetching reclamation by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
},
getReclamationBySupplierId:async(req,res)=>{
  try{
    const {iderp}=req.params;
    const reclamation= await Reclamation.findAll({where:{iderp}});

    if(!reclamation || reclamation.length===0){
      return res.status(404).json({ message: 'No reclamation found for the supplier ID' });
    }
    res.json({ success: true, reclamation });
  }catch(error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reclamations by supplier ID', error: error });
}
},
deleteReclamation: async (req, res) => {
  try {
    const { id } = req.params;
    // Find the reclamation by ID and delete it
    const deletedReclamation = await Reclamation.destroy({ where: { id } });
    if (deletedReclamation === 0) {
      // If no reclamation was deleted, it means the reclamation with the given ID does not exist
      return res.status(404).json({ error: 'Reclamation not found' });
    }
    // Respond with a success message
    res.json({ message: 'Reclamation deleted successfully' });
  } catch (error) {
    console.error('Error deleting reclamation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
},

  /*getNewReclamationsCount: async (req, res) => {
    try {
      const newReclamationsCount = await Reclamation.count({ where: { isNew: true } });
      res.json({ count: newReclamationsCount });
    } catch (error) {
      console.error('Error fetching new reclamations count:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  */
  // Define setIo method to set the io variable
  setIo: (socketIo) => {
    io = socketIo;
  }
};

module.exports = reclamationController;
