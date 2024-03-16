import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DashboardP = () => {
    const [fournisseurs, setFournisseurs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFournisseurs = async () => {
            try {
                const response = await axios.get("http://localhost:3006/fournisseur/");
                setFournisseurs(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching fournisseurs:', error);
                setLoading(false);
            }
        };

        fetchFournisseurs();
    }, []);

    return (
        <div>
            <h2>Liste des Fournisseurs</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fournisseurs.map(fournisseur => (
                            <tr key={fournisseur.iderp}>
                                <td>{fournisseur.User.name}</td>
                                <td>{fournisseur.User.email}</td>
                                <td>{fournisseur.User.phone}</td>
                                <td>
                                    <Link to={`/listcourriers/${fournisseur.iderp}`}>
                                        <button>List Factures</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DashboardP;
