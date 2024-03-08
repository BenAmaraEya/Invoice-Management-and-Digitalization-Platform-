import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [factureCounts, setFactureCounts] = useState({
    NBValide: 0,
    NBpaye: 0,
    NBFAttente: 0,
    NBFrejete: 0
  });

  useEffect(() => {
    const fetchFactureCounts = async () => {
      try {
        const response = await axios.get('http://localhost:3006/facture');
        const { NBFValide, NBFpaye, NBFAttente, NBFrejete } = response.data;
        setFactureCounts({ NBFValide, NBFpaye, NBFAttente, NBFrejete });
      } catch (error) {
        console.error('Error fetching facture counts:', error);
      }
    };

    fetchFactureCounts();
  }, []);

  return (
    <div>
      
      <div>
       
        <table className="facture-count-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Factures Validé</td>
              <td>{factureCounts.NBFValide}</td>
            </tr>
            <tr>
              <td>Factures Payé</td>
              <td>{factureCounts.NBFpaye}</td>
            </tr>
            <tr>
              <td>Factures En Attente</td>
              <td>{factureCounts.NBFAttente}</td>
            </tr>
            <tr>
              <td>Factures Rejeté</td>
              <td>{factureCounts.NBFrejete}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
