import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import '../../styles/dashboardP.css';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import 'chartjs-plugin-datalabels'; 
Chart.register(ArcElement);
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
    
            const labels = factureStatsResponse.data.nbFactureParNature.map(item => item.nature);
            const data = factureStatsResponse.data.nbFactureParNature.map(item => item.count);
    
            setFactureStats({
                nbFactureParType: factureStatsResponse.data.nbFactureParType,
                nbFactureRecuHier: factureStatsResponse.data.nbFactureRecuHier,
                nbFactureMoisEnCours: factureStatsResponse.data.nbFactureMoisEnCours,
                nbFactureParNature: factureStatsResponse.data.nbFactureParNature, // Ensure it's an array
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
   

    const renderPieChart = () => {
        const data = {
            labels: factureStats.nbFactureParNature.map(item => item.nature),
            datasets: [{
                data: factureStats.nbFactureParNature.map(item => item.count),
                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
                hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
            }]
        };
    
        return (
            <div className="pie-chart-container">
                <Pie data={data} />
                <PieLabels data={factureStats.nbFactureParNature} />
            </div>
        );
    };
    
    const PieLabels = ({ data }) => {
        const pieLabels = data.map((item, index) => (
            <div key={index} className="pie-label" style={getLabelStyle(index, data.length)}>
                <span>{item.nature}: {item.count}</span>
            </div>
        ));
    
        return pieLabels;
    };
    
    const getLabelStyle = (index, totalSegments) => {
        // Calculate the angle of the label's position
        const angle = (index / totalSegments) * 360;
        
        // Calculate the distance of the label from the center
        const distanceFromCenter = 30; // You can adjust this value based on your requirements
        
        // Calculate the coordinates based on the angle and distance from the center
        const y = Math.sin(angle * Math.PI / 180) * distanceFromCenter + 50; // Calculate the y-coordinate
        const x = Math.cos(angle * Math.PI / 180) * distanceFromCenter + 50; // Calculate the x-coordinate
        
        return {
            position: 'absolute',
            top: `${y}%`, // Set the top position based on the calculated y-coordinate
            left: `${x}%`, // Set the left position based on the calculated x-coordinate
            transform: 'translate(-50%, -50%)', // Center the label
        };
    };
    const getRandomColor = () => {
        const minBrightness = 50; // Minimum brightness value to avoid dark colors
        let color = '#';
        do {
            color = '#' + Math.floor(Math.random() * 16777215).toString(16); // Generate random hex color
        } while (calculateBrightness(color) < minBrightness); // Ensure the brightness is above the minimum threshold
        
        console.log('Brightness:', calculateBrightness(color)); // Log brightness for verification
        
        return color;
    };
    
    const calculateBrightness = (color) => {
        // Convert hex color to RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        // Calculate brightness (perceived luminance)
        return (r * 299 + g * 587 + b * 114) / 1000;
    };
    return (
        <div>
           
            <div className="dashboard-boxes">
                <div className="dashboard-box">
                    <h3>Nombre de Factures </h3>
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
                <div className="pie-chart-container">
                    <h3>Nombre de Factures par Nature</h3>
                   { renderPieChart()}
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
