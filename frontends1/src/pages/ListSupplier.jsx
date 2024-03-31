import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import "../styles/ListUser.css";
import '@fortawesome/fontawesome-free/css/all.css';
function ListUser() {
    const [fournisseur, setFounisseur] = useState([]);
    const [searchNameTerm, setSearchNameTerm] = useState('');
    const [searchIderpTerm, setSearchIderpTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchResultsIderp, setSearchResultsIderp] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3006/fournisseur/');
                setFounisseur(response.data);
            } catch (error) {
                setError(error);
                console.error('Error fetching fournisseurs:', error);
            }
        };
    
        fetchData();
    }, []);
   
    //Supprimer Fournisseur
    const DeleteFournisseur = async (iderp) => {
        try {
            await axios.delete(`http://localhost:3006/fournisseur/${iderp}`);
            setFounisseur(prevFournisseurs => prevFournisseurs.filter(fournisseur => fournisseur.iderp !== iderp));
            console.log('Fournisseur supprimé avec succès');
        } catch (error) {
            console.error('Erreur lors de la suppression du fournisseur:', error);
        }
    };
    
    // donner accées au système
    const Acesse = async (id) => {
        try {
            await axios.post(`http://localhost:3006/user/acces/${id}`);
            console.log('Envoyer accées au système avec succès');
        } catch (error) {
            console.error('Erreur :', error);
        }
    };
    const searchByName = async () => {
        try {
            const response = await axios.get(`http://localhost:3006/user/recherche/parnom?name=${searchNameTerm}`);
            const filteredResults = response.data.filter(user => user.profil == "fournisseur");
            setSearchResults(filteredResults);
            console.log(filteredResults);
            if (filteredResults == ''){
                alert("Aucun fournisseur trouvé avec cet nom.");
            }
        } catch (error) {
            setError(error);
            console.error('Error fetching search results:', error);
        }
    };
    const searchByIderp = async () => {
        try {
            const response = await axios.get(`http://localhost:3006/fournisseur/recherche/ParIdentifiant?iderp=${searchIderpTerm}`);
            setSearchResultsIderp(response.data);
            if (response.data == ''){
                alert("Aucun fournisseur trouvé avec cet iderp.");
            }
        } catch (error) {
            setError(error);
            console.error('Error fetching search results:', error);
        }
    };
    const filteredList = searchResults.length > 0 ? searchResults : fournisseur;
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
            {/* Rendu des résultats de recherche */}
            {searchResults.length > 0 && (
                <div>
                    <h3>Résultats de la recherche</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Active</th>
                                <th>Dernière Connexion</th>
                                <th>Téléphone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.map((data, i) => (
                                <tr key={i}>
                                    <td>{data.name}</td>
                                    <td>{data.username}</td>
                                    <td>{data.email}</td>
                                    <td>
                                        {data.isActive ? (
                                            <div>
                                                <i className="fas fa-check-circle"></i> Connecté
                                            </div>
                                        ) : (
                                            <div>
                                                <i className="fas fa-times-circle"></i> Déconnecté
                                            </div>
                                        )}
                                    </td>
                                    <td>{data.last_login}</td>
                                    <td>{data.phone}</td>
                                    <td>
                                        <button>
                                            <Link className="update-link" to={`../updateFournisseur/${data.iderp}`}>Modifier</Link>
                                        </button>
                                        <button onClick={() => DeleteFournisseur(data.iderp)} className="delete-button">Supprimer</button>
                                        <button className="access-button" onClick={() => Acesse(data.id)}>Accès</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
               {searchResultsIderp.length > 0 && (
                <div>
                    <h3>Résultats de la recherche</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Active</th>
                                <th>Dernière Connexion</th>
                                <th>Téléphone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResultsIderp.map((data, i) => (
                                <tr key={i}>
                                    <td>{data.User.name}</td>
                                    <td>{data.User.username}</td>
                                    <td>{data.User.email}</td>
                                    <td>
                                        {data.User.isActive ? (
                                            <div>
                                                <i className="fas fa-check-circle"></i> Connecté
                                            </div>
                                        ) : (
                                            <div>
                                                <i className="fas fa-times-circle"></i> Déconnecté
                                            </div>
                                        )}
                                    </td>
                                    <td>{data.User.last_login}</td>
                                    <td>{data.User.phone}</td>
                                    <td>
                                        <button>
                                            <Link className="update-link" to={`../updateFournisseur/${data.iderp}`}>Modifier</Link>
                                        </button>
                                        <button onClick={() => DeleteFournisseur(data.iderp)} className="delete-button">Supprimer</button>
                                        <button className="access-button" onClick={() => Acesse(data.id)}>Accès</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
            }
              {!searchResults.length > 0 && !searchResultsIderp.length >0 && (
                <div>
<Link to="/addUser" className="add-user-link">Ajouter Fournisseur</Link>   
<h3 className="list-fournisseur">Liste Fournisseurs</h3>    
     <table>
    
                <thead>
                    <tr>
                        <th>iderp</th>
                        <th>Nom</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Active</th>
                        <th>dernière connexion</th>
                        <th>Télephone</th>
                        <th>adresse</th>
                        <th>actions</th>
                    </tr>
                </thead>
                <tbody>
                    {fournisseur.map((data, i) => (
                        <tr key={i}>
                            <td>{data.iderp}</td>
                            <td>{data.User.name}</td>
                            <td>{data.User.username}</td>
                            <td>{data.User.email}</td>
                            <td>
    {data.User.isActive ? (
        <div>
            <i className="fas fa-check-circle"></i> Connecté
        </div>
    ) : (
        <div>
            <i className="fas fa-times-circle"></i> Déconnecté
        </div>
    )}
</td>
                            <td>{data.User.last_login}</td>
                            <td>{data.User.phone}</td>
                            <td>{data.adresse}</td>
                        <td>
                            <button>
                            <Link className="update-link"to={`../updateFournisseur/${data.iderp}`} >Modifier</Link>
                            </button>
                            <button onClick={() => DeleteFournisseur(data.iderp)} className="delete-button">Supprimer</button>
                            <button className="access-button" onClick={() => Acesse(data.User.id)}>Accés</button>

                        </td>
                    
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
              )}
        </div>
    );
}

export default ListUser;
