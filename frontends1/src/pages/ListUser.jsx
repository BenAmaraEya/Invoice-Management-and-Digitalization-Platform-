import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import "../styles/ListUser.css";
import '@fortawesome/fontawesome-free/css/all.css';
function ListUser() {
    const [fournisseur, setUser] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3006/fournisseur/')
            .then(res => {
                setUser(res.data); 
            })
            .catch(error => {
                setError(error);
                console.error('Error fetching fournisseurs:', error);
            });
    }, []);
    //Supprimer Fournisseur
    const DeleteFournisseur = async (iderp) => {
        try {
            await axios.delete(`http://localhost:3006/fournisseur/${iderp}`);
            setUser(prevFournisseurs => prevFournisseurs.filter(fournisseur => fournisseur.iderp !== iderp));
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
    return (
        <div>
<Link to="/addUser" className="add-user-link">Ajouter Utilisateur</Link>   
<h1>Liste Fournisseurs</h1>    
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
                            <Link to={`../updateUser/${data.iderp}`} className="update-link">Modifier</Link>
                            </button>
                            <button onClick={() => DeleteFournisseur(data.iderp)}>Supprimer</button>
                            <button onClick={() => Acesse(data.User.id)}>Accés</button>

                        </td>
                    
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListUser;
