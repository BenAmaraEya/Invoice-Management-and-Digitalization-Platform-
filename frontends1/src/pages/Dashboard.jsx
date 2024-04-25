import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import './../styles/dashboard.css';

const Dashboard = () => {
  const [reclamations, setReclamations] = useState([]);
  const [iderp, setIdErp] = useState(null);

  const [factureCounts, setFactureCounts] = useState({
    NBFValide: 0,
    NBFpaye: 0,
    NBFAttente: 0,
    NBFrejete: 0,
  });

  useEffect(() => {
    const fetchFournisseurById = async () => {
      try {
        const id = localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:3006/fournisseur/userId/${id}`);
        const iderpFromResponse = response.data.fournisseur.iderp;
        setIdErp(iderpFromResponse);
      } catch (error) {
        console.error('Error fetching fournisseur:', error);
      }
    };

    fetchFournisseurById();
  }, []);

  useEffect(() => {
    const fetchFactureCounts = async () => {
      try {
        if (iderp) {
          const response = await axios.get(`http://localhost:3006/facture/status/${iderp}`);
          const { NBFValide, NBFpaye, NBFAttente, NBFrejete } = response.data;
          setFactureCounts({ NBFValide, NBFpaye, NBFAttente, NBFrejete });
        }
      } catch (error) {
        console.error('Error fetching facture counts:', error);
      }
    };

    fetchFactureCounts();
  }, [iderp]);

  const options = {
    chart: {
      type: 'bar',
    },
    xaxis: {
      categories: ['Validé', 'Payé', 'En Attente', 'Rejeté'],
    },
  };

  const series = [
    {
      name: 'Nombre de Factures',
      data: [factureCounts.NBFValide, factureCounts.NBFpaye, factureCounts.NBFAttente, factureCounts.NBFrejete],
    },
  ];

  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        if (iderp) {
          const response = await axios.get(`http://localhost:3006/reclamation/fournisseur/${iderp}`);
          setReclamations(response.data.reclamation);
        }
      } catch (error) {
        console.error('Error fetching reclamations:', error);
      }
    };

    fetchReclamations();
  }, [iderp]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedReclamations = reclamations.filter(reclamation => !reclamation.lue);
      setReclamations(updatedReclamations);
    }, 24 * 60 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [reclamations]);

  return (
    <div className="dashboard-container">
      <h1>Tableau de bord</h1>
      <div className="chart-container">
        <Chart options={options} series={series} type="bar" height={350} />
      </div>
      <div>
        <table style={{ width: '50%' }}>
          <thead>
            <tr style={{ colspan: '2', textAlign: 'center' }}>
              <th>Liste des Réclamations</th>
            </tr>
            <tr>
              <th>Contenu</th>
              <th>État</th>
            </tr>
          </thead>
          <tbody>
            {reclamations.map((reclamation) => (
              <tr key={reclamation.id}>
                <td>{reclamation.contenu}</td>
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
    </div>
  );
};

export default Dashboard;
