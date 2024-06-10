import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/infographicLine.css';

const InfographicLine = () => {
    const { idF } = useParams();
    const [statuses, setStatuses] = useState({
        "Attente": false,
        "Envoye Finanace": false,
        "Envoye Fiscalité": false,
        "paiement": false,
        "cloture": false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEtat = async () => {
            if (!idF) {
                console.error('No idF provided');
                setError('No idF provided');
                setLoading(false);
                return;
            }

            try {
                console.log('Fetching etat for idF:', idF);
                const response = await axios.get(`http://localhost:3006/etat/etatFacture/${idF}`);
                console.log('Response data:', response.data);
                const data = response.data;
                if (Array.isArray(data)) {
                    const newStatuses = { ...statuses };
                    data.forEach(item => {
                        if (newStatuses.hasOwnProperty(item.etat)) {
                            newStatuses[item.etat] = true;
                        }
                    });
                    setStatuses(newStatuses);
                } else {
                    console.error('Unexpected data format:', data);
                    setError('Unexpected data format');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching etat:', error);
                setError('Error fetching etat. Please try again later.');
                setLoading(false);
            }
        };

        fetchEtat();
    }, [idF]);

    return (
        <div className="progress-bar-container">
            <h2 className="progress-bar-header">Etat for Facture ID: {idF}</h2>
            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}
            {!loading && !error && (
                <div className="progress-bar">
                    {Object.keys(statuses).map((status, index) => (
                        <div key={index} className={`step ${statuses[status] ? 'completed' : ''}`}>
                            <div className="step-icon">{index + 1}</div>
                            <div className="step-label">{status}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InfographicLine;
