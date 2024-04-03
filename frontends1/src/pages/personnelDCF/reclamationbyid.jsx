// Import necessary modules
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Create ReclamationDetails component
const ReclamationDetails = () => {
  // Get the reclamation ID from URL parameters
  const { id } = useParams();

  // State to store the details of the filtered reclamation
  const [reclamation, setReclamation] = useState(null);
  const [fournisseur, setFournisseur] = useState([]);

  // Fetch reclamation details based on the ID
  useEffect(() => {
    const fetchReclamation = async () => {
      try {
        // Fetch the reclamation details from the API
        const response = await axios.get(`http://localhost:3006/reclamation/${id}`, { lue: true });
        setReclamation(response.data);

        const fournisseurResponse = await axios.get('http://localhost:3006/fournisseur/');
        setFournisseur(fournisseurResponse.data);
      } catch (error) {
        console.error('Error fetching reclamation details:', error);
      }
    };

    // Call the fetchReclamation function
    fetchReclamation();
  }, [id]); // Re-run effect when ID changes
  const sendEmail = (email) => {
    const subject = encodeURIComponent('Réponse de réclamation');
    window.location.href = `mailto:${email}?subject=${subject}`;
};
  // Render the reclamation details
  return (
    <div>
      <h2>Reclamation Details</h2>
      {reclamation ? (
        <table>
          <thead>
            <tr>
              <th>Contenu de la Réclamation</th>
              <th>ID Fournisseur</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{reclamation.contenu}</td>
              <td>{reclamation.iderp}</td>
              <td>
                {fournisseur.map((fournisseurItem) => {
                  if (fournisseurItem.iderp === reclamation.iderp && fournisseurItem.User) {
                    return (
                      <button key={fournisseurItem.id} onClick={() => sendEmail(fournisseurItem.User.email)}>Répondre</button>
                    );
                  }
                  return null;
                })}
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

// Export ReclamationDetails component
export default ReclamationDetails;
