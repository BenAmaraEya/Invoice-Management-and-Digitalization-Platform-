import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/dashboardP.css'
const DashboardP = () => {
    const [factureStats, setFactureStats] = useState({
        nbFactureParType: 0,
        nbFactureRecuHier: 0,
        nbFactureMoisEnCours: 0
    });

    useEffect(() => {
        const fetchFactureStats = async () => {
            try {
                const response = await axios.get('http://localhost:3006/facture/stat');
                setFactureStats(response.data);
            } catch (error) {
                console.error('Error fetching facture stats:', error);
            }
        };

        fetchFactureStats();
    }, []);

    return (
        <div className="dashboard-boxes">
            <div className="dashboard-box">
                <h3>Nombre de Factures par Type</h3>
                <p>{factureStats.nbFactureParType}</p>
            </div>
            <div className="dashboard-box">
                <h3>Nombre de Factures Reçues Hier</h3>
                <p>{factureStats.nbFactureRecuHier}</p>
            </div>
            <div className="dashboard-box">
                <h3>Nombre de Factures ce Mois</h3>
                <p>{factureStats.nbFactureMoisEnCours}</p>
            </div>
        </div>
    );
};

export default DashboardP;
