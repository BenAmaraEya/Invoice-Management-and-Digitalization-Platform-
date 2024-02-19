import React, { useState } from "react";
import axios from 'axios';

function AddUser() {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        profil: "fournisseur", 
        telephone: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Fonction de soumission du formulaire
    const addUser = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3006/user/adduser', formData)
            .then(res => {
                console.log('Utilisateur ajouté avec succès:', res.data);
                // Réinitialiser le formulaire après l'ajout de l'utilisateur
                setFormData({
                    name: "",
                    username: "",
                    email: "",
                    profil: "fournisseur",
                    telephone: ""
                });
            })
            .catch(error => {
                console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
            });
    };

    return (
        <form onSubmit={addUser}>
            <h2>Add User</h2>
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
                <label htmlFor="telephone">Numéro Télephone</label>
                <input type="number" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Saisir numéro télephone" className='form-control' />
                <button type="submit">Submit</button>
            </div>
        </form>
    );
}

export default AddUser;
