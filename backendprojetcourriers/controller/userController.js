const { generateToken } = require('../utils/jwt'); 
const bcrypt=require('bcrypt');
const User = require("../models/User");
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'eyabenamara288@gmail.com',
      pass: 'muyl fqmf ayvs tocj'
  },
  tls: {
    rejectUnauthorized: false // Désactiver la vérification du certificat SSL
}
});
const UserController = {
    login: async (req, res, next) => {
        const { username, password } = req.body;

        try {
            const user = await User.findOne({ where: { username } });

            if (!user) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Compare hashed passwords
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            // Update user's activity status to true (logged in)
            user.isactive = true;
            user.last_login = new Date();
            await user.save();

            // Generate token
            const token = generateToken(user);
            res.json({ token, id: user.id });
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    
    //get all user
    getUser: async (req, res , next) =>{
        try {
            const users = await User.findAll();
            res.json(users);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
          }
    },
    // get user by ID
    getUserById: async (req, res , next)=>{
        const id = req.params.id;
        try {
              const user = await User.findOne({
                where: { id }
              });
              if (user) {
                res.json(user);
              } else {
                res.status(404).json({ error: 'utilisateur non trouvé' });
              }
            } catch (error) {
              console.error(error);
              res.status(500).json({ error: 'Erreur lors de la récupération du utilisateur' });
            }
          
    },


    //ajout d'un utilisateur
    adduser: async (req, res, next) => {
        try {
            const { name, username, email, phone, profil } = req.body;
            
            const password = username;
            // Hash the password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create a new user with the hashed password
            const newUser = await User.create({
                name,
                username,
                email,
                phone,
                profil,
                password: passwordHash, // Store the hashed password
                isActive: false
            });

            // Respond with success message
            res.status(201).json({ message: 'User added successfully', user: newUser });
        } catch (error) {
            console.error('Error adding user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
// mettre-a-jour utilisateur par son id 
    updateUser: async (req, res, next) => {
        const id = req.params.id;
  try {
    const [updatedRows] = await User.update(req.body, {
      where: { id }
    });

        res.json({ message: 'User updated successfully' });
      } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    //log out
    logout: async (req, res, next) => {
        try {
           id= req.params.id
          /* Check if the user is authenticated
          if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'User not authenticated' });
          }*/
      
          // Get the ID of the user from the authentication token
          const userId = id;
      
          // Update the isActive attribute of the user to false
          const user = await User.findByPk(userId);
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          //await user.update({ password: passwordhash }, { where: { id: userId } });

          user.isactive = false;
          await user.save();
      
          // Respond with success
          res.status(200).json({ message: 'User logged out successfully' });
        } catch (error) {
          console.error('Error logging out:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      },


//supprimer l'utilisateur par son id
   /* deleteUser: async (req, res, next) => {
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
    }*/
 
  
  // Route pour envoyer les informations de connexion par e-mail à un utilisateur existant
  access: async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const mailOptions = {
            from: 'eyabenamara288@gmail.com',
            to: user.email,
            subject: 'Your Login Credentials for the System',
            html: `
                <p>Dear ${user.name},</p>
                <p>Here are your temporary login credentials for the system:</p>
                <p>Username: ${user.username}</p>
                <p>Password: ${user.password}</p>
                <p>Please change your password after logging in for security reasons.</p>
                <p>Regards,</p>
                <p>Your System</p>
            `
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Login credentials sent successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
},
//modifier mot passe 
updatePassword: async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const passwordhash = await bcrypt.hash(req.body.password, 10);
        await user.update({ password: passwordhash }, { where: { id: userId } });
        res.json({ message: ' updated successfully' });
    } catch (error) {
        console.error('Error updating :', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
},


};



/*async function generatePassword() {
    
    const randomstring = require("randomstring");
    return randomstring.generate(8); 
}*/
module.exports = UserController;
