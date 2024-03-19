import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import "../styles/ListUser.css";
import '@fortawesome/fontawesome-free/css/all.css';
function ListUser() {
    const [fournisseur, setFounisseur] = useState([]);
    const [user, setUser] = useState([]);

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
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3006/user/');
                setUser(response.data);
            } catch (error) {
                setError(error);
                console.error('Error fetching utilisateur:', error);
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
     //Supprimer personnel
     const DeleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:3006/user/delete/${id}`);
            setUser(prevUsers => prevUsers.filter(user => user.id !== id));
            console.log('utilisateur supprimé avec succès');
        } catch (error) {
            console.error('Erreur lors de la suppression du utilisateur:', error);
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
    return (
        <div>
<Link to="/addUser" className="add-user-link">Ajouter Utilisateur</Link>   
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
            <h3 className="list-fournisseur">Liste BOF</h3>    
     <table>
    
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Active</th>
                        <th>dernière connexion</th>
                        <th>Télephone</th>
                        
                        <th>actions</th>
                    </tr>
                </thead>
                <tbody>
                {user.map((data, i) => (
    data.profil === "bof" && (
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
            <button onClick={() => DeleteUser(data.id)} className="delete-button">Supprimer</button>
            <button>
                 <Link className="update-link"to={`../updateUser/${data.id}`} >Modifier</Link>
             </button>
            </td>
        </tr>
    )
))}

                </tbody>
            </table>
        </div>
    );
}

export default ListUser;
