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
    },
    updatepiecejoint: async (req, res) => {
        try {
            const { piece_name } = req.body;
            const {idF} = req.params;
            const facture = await Facture.findOne({where :{ idF: idF }});
            if (!facture) {
                return res.status(404).json({ error: 'Facture not found' });
            }

            // Update piece jointe
            const existingPiecesJointes = await facture.getPieces_jointes();
            const updatedPiecesJointes = await Promise.all(existingPiecesJointes.map(async (piece) => {
                if (piece_name.includes(piece.piece_name)) {
                    return piece; // Keep existing piece jointe
                } else {
                    await piece.destroy(); // Remove piece jointe not in updated list
                    return null;
                }
            }));

            // Create new pieces jointes for added ones
            const newPiecesJointes = await Promise.all(piece_name.map(async (pieceName) => {
                if (!existingPiecesJointes.some(piece => piece.piece_name === pieceName)) {
                    return await Pieces_jointe.create({ piece_name: pieceName });
                }
            }));

            // Filter out null values and update the association
            const finalPiecesJointes = updatedPiecesJointes.filter(piece => piece !== null);
            await facture.setPieces_jointes([...finalPiecesJointes, ...newPiecesJointes]);

            res.json({ success: true, message: 'Piece jointe updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
};

module.exports = piecejointController;
