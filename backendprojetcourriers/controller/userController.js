const { generateToken } = require('../utils/jwt'); 
const bcrypt=require('bcrypt');
const User = require("../models/User");

const UserController = {
    login: async (req, res, next) => {
        const { username, password } = req.body;
        try {
            const user = await User.findOne({ where: { username } });
            if (!user) {
                return res.status(401).json({ error: 'Invalid username' });
            }
            if (password !== user.password) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            const token = generateToken(user);
            res.json({ token });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getUser: async (req, res , next) =>{
        try {
            const users = await User.findAll();
            res.json(users);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
          }
    },


    //ajout d'un utilisateur
    adduser: async(req ,res,next)=>{
      try {
          const {name,username,email,phone,profil}=req.body;
          //le mot de passe est générer automatiquement
          const password =await generatePassword()
          
          //const hashedPassword=await bcrypt.hash(password,10);
          const newUser=await User.create({
            name,
            username,
            email,
            phone,
            profil,
            password,
            

          });
          res.status(201).json({ message: 'User added successfully', user: newUser });
      } 
    catch(error){
        console.error('Error adding user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
       
    }
},
// mettre-a-jour utilisateur par son id 
    updateUser: async (req, res, next) => {
       try {
        const userId = req.params.id;
        const { name,username, email, phone, profil,isactive } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.name = name;
        user.username=username;
        user.email = email;
        user.phone = phone;
        user.profil = profil;
        user.isactive=isactive;

        await user.save();

        res.json({ message: 'User updated successfully', user });
      } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    },


//supprimer l'utilisateur par son id
    deleteUser: async (req, res, next) => {
        try {
            const userId = req.params.id;

            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            await user.destroy();

            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

async function generatePassword() {
    
    const randomstring = require("randomstring");
    return randomstring.generate(8); 
}
module.exports = UserController;
