import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/dashboardP.css';

const DashboardP = () => {
    const [factureStats, setFactureStats] = useState({
        nbFactureParType: 0,
        nbFactureRecuHier: 0,
        nbFactureMoisEnCours: 0
    });

    const [reclamations, setReclamations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const factureStatsResponse = await axios.get('http://localhost:3006/facture/stat/all');
                const reclamationsResponse = await axios.get('http://localhost:3006/reclamation');

                setFactureStats(factureStatsResponse.data);

                const reclamationsWithUserData = await Promise.all(reclamationsResponse.data.map(async reclamation => {
                    try {
                        const fournisseurResponse = await axios.get(`http://localhost:3006/fournisseur/${reclamation.fournisseurId}`);
                        const userResponse = await axios.get(`http://localhost:3006/user/`);
                        const fournisseurWithUser = { ...fournisseurResponse.data, user: userResponse.data };
                        return { ...reclamation, fournisseur: fournisseurWithUser };
                    } catch (error) {
                        console.error('Error fetching user for fournisseur:', reclamation.fournisseurId, error);
                        return reclamation;
                    }
                }));

                setReclamations(reclamationsWithUserData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const sendEmail = (email) => {
        window.location.href = `mailto:${email}?subject=reponse de reclamation`;
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
                                        {reclamation.fournisseur && reclamation.fournisseur.user && (
                                            <button onClick={() => sendEmail(reclamation.fournisseur.user.email)}>Répondre</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default DashboardP;
