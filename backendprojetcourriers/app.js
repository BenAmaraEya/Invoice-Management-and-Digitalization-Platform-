const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./database');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const fournisseurRoute = require('./routes/fournisseurRoute');
const factureRoute = require('./routes/factureRoute');
const piecejointRoute = require('./routes/piecejointRoute');
const bordereauRoute = require('./routes/bordereauxRoute');
const reclamationRoute = require('./routes/reclamationRoute');
const etatRoute = require('./routes/etatRoute');
const archiveRoute = require('./routes/archiveRoute');

connectDB();

const app = express();
app.use(express.json());
app.use(cors({
  origin:'*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const server = http.createServer(app); // Create HTTP server using Express app
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
}); // Attach socket.io to the server

const publicPath = path.join(__dirname, 'C:\Users\pc\Desktop\PFE\PFE_Project\frontends1');
app.use(express.static(publicPath));

// Define routes
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/fournisseur', fournisseurRoute);
app.use('/facture', factureRoute(io));
app.use('/piecejoint', piecejointRoute);
app.use('/bordereaux', bordereauRoute);
app.use('/reclamation', reclamationRoute(io)); // Pass io instance to reclamationRoute
app.use('/etat', etatRoute);
app.use('/archive', archiveRoute);

// Start server
const PORT = process.env.PORT || 3006;
server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}/`);
});
