import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListFournisseur = () => {
    const [fournisseurs, setFournisseurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchNameTerm, setSearchNameTerm] = useState('');
    const [searchIderpTerm, setSearchIderpTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchResultsIderp, setSearchResultsIderp] = useState([]);
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
                        return fournisseur; 
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
    const searchByName = async () => {
        try {
            const response = await axios.get(`http://localhost:3006/user/recherche/parnom?name=${searchNameTerm}`);
            console.log("Search by name response:", response.data); // Log response data for debugging
            const filteredResults = response.data.filter(user => user.profil === "fournisseur");
            console.log("Filtered results by name:", filteredResults); // Log filtered results for debugging
            setSearchResults(filteredResults);
            if (filteredResults.length === 0) {
                alert("Aucun fournisseur trouvé avec cet nom.");
            }
            console.log(searchResults);
        } catch (error) {
            console.error('Error fetching search results by name:', error);
        }
    };
    
    const searchByIderp = async () => {
        try {
            const response = await axios.get(`http://localhost:3006/fournisseur/recherche/ParIdentifiant?iderp=${searchIderpTerm}`);
            console.log("Search by iderp response:", response.data); // Log response data for debugging
            if (response.data) {
                // Update the factures state with the filtered facture data
                setSearchResultsIderp([response.data.User]);
            }
            if (response.data.length === 0) {
                alert("Aucun fournisseur trouvé avec cet iderp.");
            }
            console.log(response.data.User);
        } catch (error) {
            console.error('Error fetching search results by iderp:', error);
        }
    };
const renderSupplierTable = (data) => (
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
                    {data.map(fournisseur => (
                    <tr key={fournisseur.iderp} style={{ backgroundColor: fournisseur.status && fournisseur.status.NBFAttente > 0 ? '#ADD8E6' : 'inherit' }}>
                        {fournisseur.User ? (
                            <>
                                <td>{fournisseur.User.name}</td>
                                <td>{fournisseur.User.email}</td>
                                <td>{fournisseur.User.phone}</td>
                            </>
                        ) : (
                            <>
                                <td>{fournisseur.name}</td>
                                <td>{fournisseur.email}</td>
                                <td>{fournisseur.phone}</td>
                            </>
                        )}
                                <td>
                                    <Link
                                        to={
                                            userProfile === "bof"
                                                ? `/listcourriers/${fournisseur.iderp}`
                                                : userProfile === "personnelfiscalite"
                                                    ? `/listcourriersfiscal/${fournisseur.iderp}`
                                                    : userProfile === "agentTresorerie"
                                                        ? `/listcourrierstresorerie/${fournisseur.iderp}`
                                                
                                                        : "/defaultDestination" 
                                        }
                                    >
                                        <button>List Factures</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
);
    return (
        <div>
                  <input
                type="text"
                value={searchNameTerm}
                onChange={(e) => setSearchNameTerm(e.target.value)}
                placeholder="Rechercher par nom..."
            />
            <button onClick={searchByName}>Rechercher</button>
            <input
                type="number"
                value={searchIderpTerm}
                onChange={(e) => setSearchIderpTerm(e.target.value)}
                placeholder="Rechercher par iderp..."
            />
            <button onClick={searchByIderp}>Rechercher par identifiant</button>
            {searchResults.length > 0 && (
                    <div>
                        <h3>Résultats de la recherche</h3>
                        {renderSupplierTable(searchResults)}
                    </div>
                )}
                   {searchResultsIderp.length > 0 && (
                    <div>
                        <h3>Résultats de la recherche</h3>
                        {renderSupplierTable(searchResultsIderp)}
                    </div>
                )
                }
                 {!searchResults.length > 0 && !searchResultsIderp.length >0 && (
                     <div>
            <h2>Liste des Fournisseurs</h2>
           
            {renderSupplierTable(fournisseurs)}
            </div>
            )}
        </div>
    );
};

export default ListFournisseur;
