import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
function ListUser() {
    const [user, setUser] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3006/user/')
            .then(res => {
                setUser(res.data); 
            })
            .catch(error => {
                setError(error);
                console.error('Error fetching users:', error);
            });
    }, []);

    return (
        <div>
<Link to="/addUser">Add User</Link>            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Last login</th>
                        <th>Profil</th>
                        <th>Isactive</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {user.map((data, i) => (
                        <tr key={i}>
                            <td>{data.name}</td>
                            <td>{data.username}</td>
                            <td>{data.email}</td>
                            <td>{data.last_login}</td>
                            <td>{data.profil}</td>
                            <td>{data.isactive}</td>
                            <td>{data.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListUser;
