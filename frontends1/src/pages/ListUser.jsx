import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import "../styles/ListUser.css";
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

    return (
        <div>
<Link to="/addUser" className="add-user-link">Add supplier</Link>       
     <table>
                <thead>
                    <tr>
                        <th>id Supplier</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Last login</th>
                        <th>Profil</th>
                        <th>Isactive</th>
                        <th>Phone</th>
                        <th>actions</th>
                    </tr>
                </thead>
                <tbody>
                    {fournisseur.map((data, i) => (
                        <tr key={i}>
                            <td>{data.User.name}</td>
                            <td>{data.username}</td>
                            <td>{data.email}</td>
                            <td>{data.last_login}</td>
                            <td>{data.profil}</td>
                            <td>{data.isactive}</td>
                            <td>{data.phone}</td>
                        <td>
                            <Link to={`../updateUser/${data.id}`} className="update-link">update</Link>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListUser;
