const Pieces_jointe = require('../models/PiecesJointe');
const Facture = require('../models/Facture');

piecejointController = {
    addpiecejoint: async (req, res) => {
        try {
            const { piece_name, idFacture } = req.body; 
            const facture = await Facture.findByPk(idFacture);
            if (!facture) {
                return res.status(404).json({ error: 'Facture not found' });
            }

           
            const newPieceJointe = await Pieces_jointe.create({
                piece_name: piece_name,
            });

            
            await facture.addPieces_jointe(newPieceJointe);

            res.json({ success: true, message: 'Piece joint saved successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};

module.exports = piecejointController;
