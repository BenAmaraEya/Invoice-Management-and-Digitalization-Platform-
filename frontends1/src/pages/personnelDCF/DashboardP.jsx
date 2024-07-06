import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import '../../styles/dashboardP.css';
import { FaDownload } from 'react-icons/fa';
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
    const [lineChartData, setLineChartData] = useState({
        options: {
            chart: {
                type: 'bar'
            },
            xaxis: {
                categories: [] 
            }
        },
        series: [{
            name: 'factures traitées',
            data: [] 
        }]
    });

    useEffect(() => {
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
                console.error('erreur de recuperation de données:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);
   
    useEffect(() => {
        const fetchProcessedInvoices = async () => {
            try {
                const response = await axios.get('http://localhost:3006/facture/factureTraiteParmois/pourcentage');
                const { factures } = response.data;
    
                
                const dates = factures.map(item => item.date);
                const counts = factures.map(item => item.count);
    
                
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth() + 1;
                const daysInMonth = new Date(currentYear, currentMonth, 0).getDate(); 
    
                
                const daysOfMonth = Array.from({ length: daysInMonth }, (_, index) => index + 1);
    
                
                const data = Array(daysInMonth).fill(0);
    
                
                dates.forEach((date, index) => {
                    const day = new Date(date).getDate();
                    const count = counts[index];
                    data[day - 1] = count; 
                });
    
                
                const categories = daysOfMonth.map(day => `${currentYear}-${currentMonth}-${day}`);
    
                setLineChartData(prevState => ({
                    ...prevState,
                    options: {
                        xaxis: {
                            categories: categories
                        }
                    },
                    series: [{
                        name: 'Processed Invoices',
                        data: data
                    }]
                }));
            } catch (error) {
                console.error('Error fetching facture counts:', error);
            }
        };
    
        fetchProcessedInvoices();
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
    const generateReport = async () => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:3006/facture/generaterapports', {}, {
                responseType: 'blob' 
            });
    
            const blob = new Blob([response.data], { type: 'application/pdf' }); 
            
    
            const url = window.URL.createObjectURL(blob); 
            
    
            const link = document.createElement('a'); 
            link.href = url;
            link.setAttribute('download', 'report.pdf'); 
            document.body.appendChild(link); 
            link.click(); 
            document.body.removeChild(link); 
            window.URL.revokeObjectURL(url); 
            setLoading(false);
        } catch (error) {
            console.error('Error generating report:', error);
            setLoading(false);
        }
    };
    return (
        <div className="dashboardp-container">
             <div className="top-container">
                <button onClick={generateReport} style={{background:'#4367c4',color:'white',border:'none',marginRight:'30px',borderRadius:'5px',padding:'8px',marginTop:'20px'}}>  Generé Rapport <FaDownload style={{ marginLeft: '8px' }} /></button>
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
                    <table className='reclamation-table'>
                        <thead>
                            <tr className='reclamation-row-1'>
                                <th colSpan="3" className="header-span">Liste des Réclamations</th>
                            </tr>
                            <tr className='reclamation-row-2'>
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
                                                <button key={fournisseurItem.id} style={{background:'transparent',border:'none'}}onClick={() => sendEmailAndDeleteReclamation(fournisseurItem.User.email, reclamation.id)}>
                                                    <i className="fas fa-envelope" ></i>
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
                        <div className="card" style={{marginTop:'2px'}}>
                            <Chart options={chartData.options} series={chartData.series} type="pie" height={300} />
                        </div>
                    </div>
                    <div className="another-chart-container">
                        <div className="card">
                            <Chart options={lineChartData.options} series={lineChartData.series} type="bar" height={300} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardP;
