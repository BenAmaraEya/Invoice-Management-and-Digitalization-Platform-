const express = require('express');
const app = express();
const { connectDB, sequelize } = require('./database');
const path = require('path');
const authRoute = require('./routes/authRoute');
connectDB();
app.use(express.json());
/*const Facture = require('./models/Facture');
const Fournisseur = require('./models/Fournisseur');*/
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use('/user',authRoute);
const publicPath = path.join(__dirname, 'C:\Users\pc\Desktop\PFE\PFE_Project\frontends1');
app.use(express.static(publicPath));
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}/`);
});