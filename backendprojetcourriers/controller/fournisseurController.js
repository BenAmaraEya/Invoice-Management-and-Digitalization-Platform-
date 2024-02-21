const Fournisseur=require('../models/Fournisseur');
const User = require('../models/User');

const FournisseurController={

    //ajouter un nouveau fournisseur
    addfournisseur: async (req, res, next) => {
        try {
            const { iderp, idfiscale, adresse, nationnalite, userId } = req.body;

            //récuperer l'id de l'utilisateur associe au fournisseur
            const user = await User.findByPk(userId);
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
  //afficher les details de fournisseur     
getfournisseurbyid: async (req, res) => {
    try {
        const fournisseurId = req.params.id;
        
        const fournisseur = await Fournisseur.findByPk(fournisseurId, {
            include: User//pour afficher les details d'utilisateur (les information de fournisseur dans le table user) 
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
        const fournisseurId = req.params.id;

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