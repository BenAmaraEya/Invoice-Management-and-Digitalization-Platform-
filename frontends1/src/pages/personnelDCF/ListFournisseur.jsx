import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListFournisseur = () => {
    const [fournisseurs, setFournisseurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const userProfile = localStorage.getItem("userProfil");

    useEffect(() => {
        const fetchFournisseurs = async () => {
            try {
                const response = await axios.get("http://localhost:3006/fournisseur/");
                const fournisseursWithStatus = await Promise.all(response.data.map(async fournisseur => {
                    try {
                        const statusResponse = await axios.get(`http://localhost:3006/facture/status/${fournisseur.iderp}`);
                        return { ...fournisseur, status: statusResponse.data };
                    } catch (error) {
                        console.error('Error fetching status for fournisseur:', fournisseur.iderp, error);
                        return fournisseur; // If status fetch fails, return fournisseur without status
                    }
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
                                <td>{fournisseur.User && fournisseur.User.name}</td>
                                <td>{fournisseur.User && fournisseur.User.email}</td>
                                <td>{fournisseur.User && fournisseur.User.phone}</td>
                                <td>
                                    <Link
                                        to={
                                            userProfile === "bof"
                                                ? `/listcourriers/${fournisseur.iderp}`
                                                : userProfile === "personnelfiscalite"
                                                    ? `/listcourriersfiscal/${fournisseur.iderp}`
                                                    : userProfile === "agentTresorerie"
                                                        ? `/listcourrierstresorerie/${fournisseur.iderp}`
                                                        : "/defaultDestination" // Provide a default destination
                                        }
                                    >
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
