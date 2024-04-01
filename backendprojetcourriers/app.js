const express = require('express');
const app = express();
const cors = require('cors');
const requestIp = require('request-ip');
const { connectDB, sequelize } = require('./database');
const path = require('path');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const fournisseurRoute = require('./routes/fournisseurRoute');
const factureRoute = require('./routes/factureRoute');
const piecejointRoute= require ('./routes/piecejointRoute');
const bordereauRoute =require('./routes/bordereauxRoute');
const reclamationRoute =require('./routes/reclamationRoute');
connectDB();
app.set('trust proxy', true);
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const Bordereau=require('./models/Bordereau');

// Serve static files
const publicPath = path.join(__dirname, 'C:\Users\pc\Desktop\PFE\PFE_Project\frontends1');
app.use(express.static(publicPath));

// Define routes
app.use('/auth', authRoute); // Authentication routes
app.use('/user', userRoute); // User-related routes
app.use('/fournisseur', fournisseurRoute); // Fournisseur routes
app.use('/facture',factureRoute);
app.use('/piecejoint',piecejointRoute);
app.use('/bordereaux',bordereauRoute);
app.use('/reclamation',reclamationRoute);

// Start server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}/`);
});
