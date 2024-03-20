import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListFactByB = () => {
    const [factures, setFactures] = useState([]);
    const [idB, setIdB] = useState(null); // Initialize idB as null

    useEffect(() => {
        fetchBordereaux();
    }, []);

    const fetchBordereaux = async () => {
        try {
            const response = await axios.get('http://localhost:3006/bordereaux');
            const { idB } = response.data; // Extract idB from response data
            setIdB(idB); // Set idB state
        } catch (error) {
            console.error('Error fetching bordereaux:', error);
        }
    };

    useEffect(() => {
        if (idB) { // Check if idB is not null
            fetchFactures(idB);
        }
    }, [idB]); // Trigger useEffect when idB changes

    const fetchFactures = async (idB) => {
        try {
            const response = await axios.get(`http://localhost:3006/bordereaux/${idB}/factures`);
            setFactures(response.data.factures);
        } catch (error) {
            console.error('Error fetching factures:', error);
        }
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Facture ID</th>
                        <th>Numéro Facture</th>
                        <th>Facture Name</th>
                        <th>Montant</th>
                        <th>Status</th>
                        <th>Numéro PO</th>
                        <th>Date Facture</th>
                    </tr>
                </thead>
                <tbody>
                    {factures.map((facture) => (
                        <tr key={facture.idF}>
                            <td>{facture.idF}</td>
                            <td>{facture.num_fact}</td>
                            <td>{facture.factname}</td>
                            <td>{facture.montant}</td>
                            <td>{facture.status}</td>
                            <td>{facture.num_po}</td>
                            <td>{facture.date_fact}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListFactByB;
