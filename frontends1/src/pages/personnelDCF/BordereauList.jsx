import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BordereauList = () => {
    const [bordereaux, setBordereaux] = useState([]);

    useEffect(() => {
        fetchBordereaux();
    }, []);

    const fetchBordereaux = async () => {
        try {
            const response = await axios.get('http://localhost:3006/bordereaux');
            setBordereaux(response.data.bordereaux);
        } catch (error) {
            console.error('Error fetching bordereaux:', error);
        }
    };

    return (
        <div>
            <h2>Liste des Bordereaux</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nature</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {bordereaux.map((bordereau) => (
                        <tr key={bordereau.idBordereau}>
                            <td>{bordereau.nature}</td>
                            <td>{bordereau.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BordereauList;
