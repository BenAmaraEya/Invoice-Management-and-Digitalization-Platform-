// controllers/PiecesJointeController.js
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

            const newPiecesJointes = await Promise.all(piece_name.map(async (pieceName) => {
                return await Pieces_jointe.create({ piece_name: pieceName });
            }));

            await facture.addPieces_jointes(newPiecesJointes);

            res.json({ success: true, message: 'Pieces jointes saved successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};

module.exports = piecejointController;
