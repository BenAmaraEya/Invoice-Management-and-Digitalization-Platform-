import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReclamationForm = () => {
    const [contenu, setContenu] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [iderp, setIdErp] = useState('');

    useEffect(() => {
        const fetchFournisseurByUserId = async () => {
            try {
                const id = localStorage.getItem('userId');
                const response = await axios.get(`http://localhost:3006/fournisseur/userId/${id}`);
                const iderp = response.data.fournisseur.iderp;
                setIdErp(iderp);
            } catch (error) {
                console.error('Error fetching fournisseur:', error);
            }
        };

        fetchFournisseurByUserId();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (iderp) {
                const response = await axios.post(`http://localhost:3006/reclamation/envoyer/${iderp}`, { contenu });
                console.log(response.data); // Assuming you want to log the response
                // Reset the form after successful submission
                setContenu('');
                setErrorMessage('');
            }
            // You can add further actions after successful submission if needed
        } catch (error) {
            console.error('Error sending reclamation:', error);
            setErrorMessage('Erreur lors de l\'envoi de la réclamation');
        }
    };

    return (
        <div>
            <h2>Envoyer une réclamation</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="contenu">Contenu de la réclamation:</label>
                    <textarea id="contenu" value={contenu} onChange={(e) => setContenu(e.target.value)} required />
                </div>
                {errorMessage && <p>{errorMessage}</p>}
                <button type="submit">Envoyer</button>
            </form>
        </div>
    );
};

export default ReclamationForm;
