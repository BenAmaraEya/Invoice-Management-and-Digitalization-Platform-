import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../styles/dashboard.css';

const Dashboard = () => {
  const [factureCounts, setFactureCounts] = useState({
    NBFValide: 0,
    NBFpaye: 0,
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
      <div className="small-box bg-gradient-success">
        <div className="inner">
          <h3>{factureCounts.NBFValide}</h3>
          <p>Factures Validé</p>
        </div>
      </div>

      <div className="small-box bg-gradient-pay">
        <div className="inner">
          <h3>{factureCounts.NBFpaye}</h3>
          <p>Factures Payé</p>
        </div>
      </div>

      <div className="small-box bg-gradient-attente">
        <div className="inner">
          <h3>{factureCounts.NBFAttente}</h3>
          <p>Factures En Attente</p>
        </div>
      </div>

      <div className="small-box bg-gradient-rejete">
        <div className="inner">
          <h3>{factureCounts.NBFrejete}</h3>
          <p>Factures Rejeté</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;