import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import "../styles/ListUser.css";
import '@fortawesome/fontawesome-free/css/all.css';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';

function ListUser() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3006/user/');
                setUsers(response.data);
            } catch (error) {
                setError(error);
                console.error('Error fetching users:', error);
            }
        };

        fetchData();
    }, []);

    const DeleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:3006/user/delete/${id}`);
            setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
            console.log('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const Acesse = async (id) => {
        try {
            await axios.post(`http://localhost:3006/user/acces/${id}`);
            console.log('Access granted successfully');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const SearchName = async () => {
        try {
            const response = await axios.get(`http://localhost:3006/user/recherche/parnom?name=${searchTerm}`);
            const filteredResults = response.data.filter(user => user.profil !== "fournisseur");
            setSearchResults(filteredResults);
            if (filteredResults.length === 0) {
                alert("No user found with this name.");
            }
            console.log(filteredResults);
        } catch (error) {
            setError(error);
            console.error('Error fetching search results:', error);
        }
    };

    const renderUserTable = (users) => (
        <table className="user-table">
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
                {users.map((user, i) => (
                    <tr key={i}>
                        <td>{user.name}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                            {user.isActive ? (
                                <div>
                                    <i className="fas fa-check-circle"></i> Connecté
                                </div>
                            ) : (
                                <div>
                                    <i className="fas fa-times-circle"></i> Déconnecté
                                </div>
                            )}
                        </td>
                        <td>{user.last_login}</td>
                        <td>{user.phone}</td>
                        <td>
                            <button onClick={() => DeleteUser(user.id)} style={{ background: 'none', border: 'none' }}>
                            <FaTrashAlt className='delete-btn' style={{ fontSize: '20px', backgroundColor: 'transparent', color: 'black' }} />
                            </button>
                            <Link  to={`../updateUser/${user.id}`}>
                            <FaEdit className='edit' color="black" style={{ fontSize: '20px', marginLeft: '5px' }} />
                            </Link>
                            <button onClick={() => Acesse(user.id)} className="access-button">Access</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const adminPassword = localStorage.getItem('adminPassword');

    const filteredList = searchResults.length > 0 ? searchResults : users;
    const bofUsers = filteredList.filter(user => user.profil === "bof");
    const personnelfiscaliteUsers = filteredList.filter(user => user.profil === "personnelfiscalite");
    const agentTresorerieUsers = filteredList.filter(user => user.profil === "agentTresorerie");

    return (
        <div className="list-user-container">
            <div className="search-container">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher par nom..."
                    className="search-input"
                />
                <button onClick={SearchName} className="search-button">Rechercher</button>
            </div>

            <Link to={`/admin/addUser/${adminPassword}`} className="add-user-link">Ajouter Utilisateur</Link>

            <h3 className="list-title">Liste BOF</h3>
            {renderUserTable(bofUsers)}

            <h3 className="list-title">Liste Personnel Fiscalité</h3>
            {renderUserTable(personnelfiscaliteUsers)}

            <h3 className="list-title">Liste Agent Trésorerie</h3>
            {renderUserTable(agentTresorerieUsers)}
        </div>
    );
}

export default ListUser;
