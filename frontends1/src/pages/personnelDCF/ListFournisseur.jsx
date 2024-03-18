import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListFournisseur = () => {
    const [fournisseurs, setFournisseurs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFournisseurs = async () => {
            try {
                const response = await axios.get("http://localhost:3006/fournisseur/");
                const fournisseursWithStatus = await Promise.all(response.data.map(async fournisseur => {
                    const statusResponse = await axios.get(`http://localhost:3006/facture/status/${fournisseur.iderp}`);
                    return { ...fournisseur, status: statusResponse.data };
                }));
                setFournisseurs(fournisseursWithStatus);
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
                            <tr key={fournisseur.iderp} style={{ backgroundColor: fournisseur.status && fournisseur.status.NBFAttente > 0 ? '#ADD8E6' : 'inherit' }}>
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

export default ListFournisseur;
