const Fournisseur=require('../models/Fournisseur');
const User = require('../models/User');

const FournisseurController={
    addfournisseur: async (req, res, next) => {
        try {
            const { iderp, idfiscale, adresse, nationnalite, userId } = req.body;

            // Check if the user exists
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Create the fournisseur associated with the user
            const newFournisseur = await Fournisseur.create({
                iderp,
                idfiscale,
                adresse,
                nationnalite,
                UserId: userId // Associate the Fournisseur with the User
            });

            res.status(201).json({ message: 'Fournisseur added successfully', fournisseur: newFournisseur });
        } catch (error) {
            console.error('Error adding Fournisseur:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    updatefournisseur:async(req,res,next)=>
    {
        try{
            const fournisseurId=req.params.id;
            const {iderp,idfiscale,adresse,nationalite}=req.body;
            const fournisseur= await Fournisseur.findByPk(fournisseurId);
            if (!fournisseur) {
                return res.status(404).json({ error: 'User not found' });
            }
       
            fournisseur.iderp = iderp;
            fournisseur.idfiscale=idfiscale;
            fournisseur.adresse = adresse;
            fournisseur.nationalite = nationalite;
           
       
            await fournisseur.save();
       
            res.json({ message: 'fournisseur updated successfully', fournisseur });
          } catch (error) {
            console.error('Error updating fournisseur:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            }
        },
        // Assuming you have a route handler for fetching a fournisseur by ID
getfournisseurbyid: async (req, res) => {
    try {
        const fournisseurId = req.params.id;

        const fournisseur = await Fournisseur.findByPk(fournisseurId, {
            include: User // Include the associated User
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

    
deletefournisseur : async (req, res, next) => {
    try {
        const fournisseurId = req.params.id;

        // Find the fournisseur
        const fournisseur = await Fournisseur.findByPk(fournisseurId);
        if (!fournisseur) {
            return res.status(404).json({ error: 'Fournisseur not found' });
        }

        // Delete the fournisseur
        await fournisseur.destroy();

        res.json({ message: 'Fournisseur deleted successfully' });
    } catch (error) {
        console.error('Error deleting fournisseur:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
},

};

module.exports=FournisseurController;