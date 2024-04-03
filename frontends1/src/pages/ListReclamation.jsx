import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons';

const ReclamationList = () => {
  const [reclamations, setReclamations] = useState([]);

  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        const response = await axios.get('http://localhost:3006/reclamation');
        setReclamations(response.data);
      } catch (error) {
        console.error('Error fetching reclamations:', error);
      }
    };

    fetchReclamations();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedReclamations = reclamations.filter(reclamation => !reclamation.lue);
      setReclamations(updatedReclamations);
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

    return () => clearTimeout(timer);
  }, [reclamations]);

  return (
    <div>
      <h2>Liste des Réclamations</h2>
      <table>
        <thead>
          <tr>
            <th>Contenu</th>
            <th>ID Fournisseur</th>
            <th>État</th>
          </tr>
        </thead>
        <tbody>
          {reclamations.map((reclamation) => (
            <tr key={reclamation.id}>
              <td>{reclamation.contenu}</td>
              <td>{reclamation.idFournisseur}</td>
              <td>
                {reclamation.lue ? (
                  <FontAwesomeIcon icon={faCheckDouble} />
                ) : (
                  <span>Unseen</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReclamationList;
