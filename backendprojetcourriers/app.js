const express = require('express');
const app = express();
const cors = require('cors');
const { connectDB, sequelize } = require('./database');
const path = require('path');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const fournisseurRoute = require('./routes/fournisseurRoute');

connectDB();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));



// Serve static files
const publicPath = path.join(__dirname, 'C:\Users\pc\Desktop\PFE\PFE_Project\frontends1');
app.use(express.static(publicPath));

// Define routes
app.use('/auth', authRoute); // Authentication routes
app.use('/user', userRoute); // User-related routes
app.use('/fournisseur', fournisseurRoute); // Fournisseur routes

// Start server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}/`);
});
