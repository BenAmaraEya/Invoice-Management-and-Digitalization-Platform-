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
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [factureStatsResponse, reclamationsResponse, fournisseurResponse] = await Promise.all([
                axios.get('http://localhost:3006/facture/stat/all'),
                axios.get('http://localhost:3006/reclamation'),
                axios.get('http://localhost:3006/fournisseur/')
            ]);
            setFactureStats(factureStatsResponse.data);
            setFournisseur(fournisseurResponse.data);
            setReclamations(reclamationsResponse.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const sendEmailAndDeleteReclamation = async (email, reclamationId) => {
        try {
            const subject = encodeURIComponent('Réponse de réclamation');
            window.location.href = `mailto:${email}?subject=${subject}`;
            
            const confirmationResult = window.confirm('Confirmez-vous que vous avez envoyé le mail?');
        
            if (confirmationResult) {
                deleteReclamation(reclamationId);
            } else {
                console.log('Operation canceled');
            }
            
           
        } catch (error) {
            console.error('Error sending email and deleting reclamation:', error);
        }
    };

    const deleteReclamation = async (reclamationId) => {
        try {
            await axios.delete(`http://localhost:3006/reclamation/${reclamationId}`);
            setReclamations(reclamations.filter(reclamation => reclamation.id !== reclamationId));
        } catch (error) {
            console.error('Error deleting reclamation:', error);
        }
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
            {userProfile === "bof" && (
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
                                            {fournisseur.map((fournisseurItem) => (
                                                fournisseurItem.iderp === reclamation.iderp && fournisseurItem.User ? (
                                                    <button key={fournisseurItem.id} onClick={() => sendEmailAndDeleteReclamation(fournisseurItem.User.email, reclamation.id)}>Répondre</button>
                                                ) : null
                                            ))}
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
