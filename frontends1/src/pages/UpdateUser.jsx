import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams, useHistory } from "react-router-dom";
import "../styles/AddUser.css";

function UpdateUser() {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        profil: "", 
        phone: ""
    });
    const { id } = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3006/user/${id}`);
                const userData = response.data;
                setFormData(prevState => ({
                    ...prevState,
                    name: userData.name,
                    username: userData.username,
                    email: userData.email,
                    profil: userData.profil, 
                    phone: userData.phone
                }));
            } catch (error) {
                console.error('Erreur lors de la récupération des données de l\'utilisateur:', error);
            }
        };

        fetchUserData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const updateuser = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3006/user/update/`+id, formData);
            console.log('Utilisateur modifié avec succès');
            
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        }
    };

    return (
        <form onSubmit={updateuser} className="add-user-form">
            <h2>Update User</h2>
            <div>
                <label htmlFor="name">Nom</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Saisir Nom" className='form-control' />
                <label htmlFor="username">Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Saisir Username" className='form-control' />
                <label htmlFor="email">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Saisir Email" className='form-control' />
                <label htmlFor="profil">Profil</label>
                <select name="profil" value={formData.profil} onChange={handleChange} className='form-control'>
                    <option value="fournisseur">Fournisseur</option>
                    <option value="bof">BOF</option>
                    <option value="personnelFinance">Personnel Finance</option>
                </select>
                <label htmlFor="phone">Numéro Télephone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Saisir numéro télephone" className='form-control' />
                <button type="submit">Update</button>
            </div>
        </form>
    );
}

export default UpdateUser;
