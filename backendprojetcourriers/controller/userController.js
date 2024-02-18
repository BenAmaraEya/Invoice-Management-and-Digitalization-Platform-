const { generateToken } = require('../utils/jwt'); 
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
    }
};

module.exports = UserController;
