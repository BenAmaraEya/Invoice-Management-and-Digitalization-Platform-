import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import '../../styles/dashboardP.css';

const DashboardP = () => {
    const [factureStats, setFactureStats] = useState({
        nbFactureParType: 0,
        nbFactureRecuHier: 0,
        nbFactureMoisEnCours: 0,
        nbFactureParNature: []
    });
    const [fournisseur, setFournisseur] = useState([]);
    const [reclamations, setReclamations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({
        options: {
            chart: {
                type: 'pie'
            },
            labels: [],
        },
        series: [],
    });
    const userProfile = localStorage.getItem("userProfil");

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const natureLabels = factureStats.nbFactureParNature.map(item => item.nature);
        const natureCounts = factureStats.nbFactureParNature.map(item => item.count);

        setChartData({
            options: {
                chart: {
                    type: 'pie'
                },
                labels: natureLabels,
            },
            series: natureCounts,
        });
    }, [factureStats]);

    const fetchData = async () => {
        try {
            const [factureStatsResponse, reclamationsResponse, fournisseurResponse] = await Promise.all([
                axios.get('http://localhost:3006/facture/stat/all'),
                axios.get('http://localhost:3006/reclamation'),
                axios.get('http://localhost:3006/fournisseur/')
            ]);

            setFactureStats({
                nbFactureParType: factureStatsResponse.data.nbFactureParType,
                nbFactureRecuHier: factureStatsResponse.data.nbFactureRecuHier,
                nbFactureMoisEnCours: factureStatsResponse.data.nbFactureMoisEnCours,
                nbFactureParNature: factureStatsResponse.data.nbFactureParNature,
            });

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
        <div className="dashboard-container">
            <div className="top-container">
                <div className="download-button">
                    <button>
                        rapport <i className="fas fa-download"></i>
                    </button>
                </div>
            </div>
            <div className="middle-container">
                <div className="boxes-container">
                    <div className="dashboard-box border-left-primary">
                        <h4>Nombre de Factures </h4>
                        <p>{factureStats.nbFactureParType}</p>
                    </div>
                    <div className="dashboard-box border-left-success">
                        <h4>Nombre de Factures Reçues Hier</h4>
                        <p>{factureStats.nbFactureRecuHier}</p>
                    </div>
                    <div className="dashboard-box border-left-warning">
                        <h4>Nombre de Factures ce Mois</h4>
                        <p>{factureStats.nbFactureMoisEnCours}</p>
                    </div>
                </div>
            </div>
            <div className="bottom-container">
                <div className="left-side">
                    
                    <table>
                        <thead>
                        <tr>
                <th colSpan="3" className="header-span">Liste des Réclamations</th>
            </tr>
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
                                                <button key={fournisseurItem.id} onClick={() => sendEmailAndDeleteReclamation(fournisseurItem.User.email, reclamation.id)}>
                                                    <i className="fas fa-envelope"></i>
                                                </button>
                                            ) : null
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="right-side">
                    <div className="pie-chart-container">
                        <div className="card">
                            <Chart options={chartData.options} series={chartData.series} type="pie" height={300} />
                        </div>
                    </div>
                    <div className="another-chart-container">
                        <div className="card">
                            <p>Another chart placeholder</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardP;
