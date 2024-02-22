import React, { useState } from "react";
import axios from 'axios';
import "../styles/AddUser.css";

function AddUser() {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        profil: "fournisseur", 
        telephone: "",
        iderp: "",
        idFiscale: "",
        adresse: "",
        nationnalite: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = formData.profil === "fournisseur" ? 'http://localhost:3006/fournisseur/addfournisseur' : 'http://localhost:3006/user/adduser';
        
            const response = await axios.post(url, formData);
            console.log('Utilisateur ajouté avec succès:', response.data);

            // Clear form fields after successful submission
            setFormData({
                name: "",
                username: "",
                email: "",
                profil: "fournisseur",
                telephone: "",
                iderp: "",
                idFiscale: "",
                adresse: "",
                nationnalite: ""
            });
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-user-form">
            <h2>Ajouter Utilisateur</h2>
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
                <label htmlFor="telephone">Numéro Téléphone</label>
                <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Saisir numéro téléphone" className='form-control' />
                {formData.profil === "fournisseur" && (
                    <div>
                        <h3>Formulaire Fournisseur</h3>
                        <label htmlFor="iderp">iderp</label>
                        <input type="text" name="iderp" value={formData.iderp} onChange={handleChange} className='form-control' />
                        <label htmlFor="idFiscale">idFiscale</label>
                        <input type="text" name="idFiscale" value={formData.idFiscale} onChange={handleChange} className='form-control' />
                        <label htmlFor="adresse">Adresse</label>
                        <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} className='form-control' />
                        <label htmlFor="nationnalite">Nationalité</label>
                        <input type="text" name="nationnalite" value={formData.nationnalite} onChange={handleChange} className='form-control' />
                    </div>
                )}
                <button type="submit">Ajouter</button>
            </div>
        </form>
    );
}

export default AddUser;
