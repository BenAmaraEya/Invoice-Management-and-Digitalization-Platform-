import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/dashboardP.css';

const DashboardP = () => {
    const [factureStats, setFactureStats] = useState({
        nbFactureParType: 0,
        nbFactureRecuHier: 0,
        nbFactureMoisEnCours: 0
    });
    const [fournisseur, setFournisseur] = useState([]);
    const [reclamations, setReclamations] = useState([]);
    const [loading, setLoading] = useState(true);
    const userProfile = localStorage.getItem("userProfil");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const factureStatsResponse = await axios.get('http://localhost:3006/facture/stat/all');
                const reclamationsResponse = await axios.get('http://localhost:3006/reclamation');

                setFactureStats(factureStatsResponse.data);

              
                        const fournisseurResponse = await axios.get('http://localhost:3006/fournisseur/');
                       
                       setFournisseur(fournisseurResponse.data)

                   

                setReclamations(reclamationsResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const sendEmail = (email) => {
        const subject = encodeURIComponent('Réponse de réclamation');
        window.location.href = `mailto:${email}?subject=${subject}`;
    };

    return (
        <div>
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
            {userProfile === "bof" && ( // Render the section only for bof users
                <div>
                    <h3>Liste des Réclamations</h3>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Contenu de la Réclamation</th>
                                    <th>id fournisseur</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {reclamations.map((reclamation) => (
    <tr key={reclamation.id}>
        <td>{reclamation.contenu}</td>
        <td>{reclamation.iderp}</td>
        <td>
            {fournisseur.map((fournisseurItem) => {
                console.log(fournisseurItem.User)
                if (fournisseurItem.iderp === reclamation.iderp && fournisseurItem.User) {
                    return (
                        <button key={fournisseurItem.id} onClick={() => sendEmail(fournisseurItem.User.email)}>Répondre</button>
                    );
                }
                return null;
            })}
        </td>
    </tr>
))}
                              
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default DashboardP;
