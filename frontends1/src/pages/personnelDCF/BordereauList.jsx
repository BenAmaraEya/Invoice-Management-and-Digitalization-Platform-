import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ListFactByB from './ListFactByB';
import { FaSearch, FaFileAlt } from 'react-icons/fa';
const BordereauList = () => {
    const [bordereaux, setBordereaux] = useState([]);
    const navigate = useNavigate();

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

    const handleViewFactures = (idB) => {
        navigate(`/fact/${idB}`);
    };

    return (
        <div>
            
            <table style={{width:'50%',marginLeft:'30%' }}>
                <thead>
                    <tr>
                        <th colSpan={3} style={{textAlign:'center'}}>Liste des Bordereaux</th>
                    </tr>
                    <tr >
                        <th>Nature</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody >
                    {bordereaux.map((bordereau) => (
                        <tr key={bordereau.idB} >
                            <td>{bordereau.nature}</td>
                            <td>{bordereau.date}</td>
                            
                            <td   >
                                <button onClick={() => handleViewFactures(bordereau.idB)}><FaFileAlt />Voir Factures</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BordereauList;
