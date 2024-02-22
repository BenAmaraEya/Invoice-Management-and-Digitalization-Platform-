const Fournisseur=require('../models/Fournisseur');
const User = require('../models/User');

const FournisseurController={

    //ajouter un nouveau fournisseur
    addfournisseur: async (req, res, next) => {
        try {
            const { iderp, idfiscale, adresse, nationnalite, userId } = req.body;

            //récuperer l'id de l'utilisateur associe au fournisseur
            const user = await User.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            //créer un nouveau fournisseur 
            const newFournisseur = await Fournisseur.create({
                iderp,
                idfiscale,
                adresse,
                nationnalite,
                UserId: userId
            });

            res.status(201).json({ message: 'Fournisseur added successfully', fournisseur: newFournisseur });
        } catch (error) {
            console.error('Error adding Fournisseur:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    //mettre-a-jour le fournisseur 
    updateFournisseur: async (req, res, next) => {
        try {
            const iderp = req.params.iderp;
            const { idfiscale, adresse, nationnalite, userId, ...fournisseurData } = req.body;
    
                const [updatedFournisseurRows] = await Fournisseur.update(fournisseurData, {
                where: { iderp }
            });
    
            // Vérifiez si l'ID de l'utilisateur existe
            const user = await User.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            // Mettez à jour les données de l'utilisateur
            await User.update(req.body, { where: { id: userId } });
    
            res.json({ message: 'Fournisseur updated successfully' });
        } catch (error) {
            console.error('Error updating fournisseur:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    
    
          //get all user
    getFournisseur: async (req, res , next) =>{
        try {
            const users = await Fournisseur.findAll(
                {include:User}
            );
            res.json(users);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
          }
        },
  //get fournisseur by ID  
getfournisseurbyid: async (req, res) => {
    try {
        const iderp = req.params.iderp;
        
        const fournisseur = await Fournisseur.findOne({where: { iderp }, 
            include: User 
        });

        if (!fournisseur) {
            return res.status(404).json({ error: 'Fournisseur not found' });
        }

        res.json({ fournisseur });
    } catch (error) {
        console.error('Error fetching fournisseur:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
},

 //supprimer le fournisseur    
deletefournisseur: async (req, res, next) => {
    try {
        const fournisseurId = req.params.iderp;

        // trouver le fournisseur et l'utilisateur associe
        const fournisseur = await Fournisseur.findByPk(fournisseurId, {
            include: User 
        });
        if (!fournisseur) {
            return res.status(404).json({ error: 'Fournisseur not found' });
        }

        // acceder au utilisateur associe au fournisseur
        const user = fournisseur.User;

        // supprime l'utilisateur associe si exist 
        if (user) {
            await user.destroy();
        } else {
            console.error('Associated user not found');
        }
        await fournisseur.destroy();

        res.json({ message: 'Fournisseur and associated User deleted successfully' });
    } catch (error) {
        console.error('Error deleting fournisseur:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
},

};

module.exports=FournisseurController;