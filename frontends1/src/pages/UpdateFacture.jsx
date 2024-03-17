import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const UpdateFactureDetailsPage = () => {
  const { idF } = useParams();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [forceRender, setForceRender] = useState(false);
  const [facture, setFacture] = useState({
    num_fact: '',
    num_po: '',
    date_fact: '',
    montant: '',
    factname: '',
    devise: 'TND',
    nature: '',
    objet: '',
    datereception: '',
    pathpdf: '',
  });

  useEffect(() => {
    const fetchFactureDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3006/facture/facturebyId/${idF}`);
        const fetchedFacture = response.data.facture;
        
        if (fetchedFacture) {
          setFacture(prevFacture => ({
            ...prevFacture,
            num_fact: fetchedFacture.num_fact || '',
            num_po: fetchedFacture.num_po || '',
            date_fact: fetchedFacture.date_fact || '',
            montant: fetchedFacture.montant || '',
            factname: fetchedFacture.factname || '',
            devise: fetchedFacture.devise || 'TND',
            nature: fetchedFacture.nature || '',
            objet: fetchedFacture.objet || '',
            datereception: fetchedFacture.datereception || '',
            pathpdf: fetchedFacture.pathpdf || '',
          }));
        } else {
          console.error('Facture data not found in response');
        }
      } catch (error) {
        console.error('Error fetching facture details:', error);
      }
    };
  
    fetchFactureDetails();
  }, [idF]);

  useEffect(() => {
    setForceRender(prevState => !prevState);
  }, [facture]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFacture(prevFacture => ({
      ...prevFacture,
      [name]: value,
    }));
  };
  const handleDateChange = (date) => {
    setFacture(prevFacture => ({
      ...prevFacture,
      date_fact: date,
      datereception:date
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.put(`http://localhost:3006/facture/updateFacture/${idF}`, facture);
      alert('Facture details updated successfully');
    } catch (error) {
      console.error('Error updating facture details:', error);
      alert('Failed to update facture details');
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const changeDocuments = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      const formData = new FormData();
    formData.append('factureFile', file); 
  
      const response = await axios.post('http://localhost:3006/facture/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          //Authorization: `Bearer ${token}`
        }
      });
  
      const extractedInfo = response.data.extractedInfo;
      const filePath = `uploads/${fileName}`;
  
      // Update the form fields with the extracted data
      setFacture(prevFacture => ({
        ...prevFacture,
        num_fact: extractedInfo.num_fact || facture.num_fact || '',
        num_po: extractedInfo.num_po || facture.num_po ||'',
        date_fact: extractedInfo.date_fact ||facture.date_fact || '',
        montant: extractedInfo.montant || facture.montant ||'',
        factname: extractedInfo.factname || facture.factname ||'',
        devise: extractedInfo.devise ||facture.devise || 'TND',
        nature: extractedInfo.nature ||facture.nature || '',
        objet: extractedInfo.objet ||facture.objet || '',
        datereception: extractedInfo.datereception || facture.datereception ||'',
        pathpdf: filePath || '', 
      }));
    } catch (error) {
      console.log('Error uploading facture');
    }
  };

  return (
    <div>
      <h1>Modifier Facture </h1>
      <form onSubmit={handleSubmit}>
        <label>
          Numéro de Facture:
          <input type="text" name="num_fact" value={facture.num_fact} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Numéro PO:
          <input type="text" name="num_po" value={facture.num_po} onChange={handleChange} />
        </label>
        <br />
        <label>
          Date de facture:
          <DatePicker selected={facture.date_fact} onChange={handleDateChange} />        </label>
        <br />
        <label>
          Montant:
          <input type="number" name="montant" value={facture.montant} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Nom de Facture:
          <input type="text" name="factname" value={facture.factname} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Devise:
          <select name="devise" value={facture.devise} onChange={handleChange} required>
            <option value="TND">TND</option>
            <option value="EURO">EURO</option>
            <option value="USD">USD</option>
          </select>
        </label>
        <br />
        <label>
          Nature:
          <input type="text" name="nature" value={facture.nature} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Objet:
          <input type="text" name="objet" value={facture.objet} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Date de Réception:
          <DatePicker selected={facture.datereception} onChange={handleDateChange} />         </label>
        <br />
        <label>
          Chemin PDF:
          <input type="text" name="pathpdf" value={facture.pathpdf} onChange={handleChange} required />
        </label>
        <label>
          Modifier Document:
          <input type="file" onChange={handleFileChange} accept=".pdf" />
          <button className="upload-btn" onClick={changeDocuments}>
            Modifier Document
          </button>
        </label>
        <br />
        <button type="submit">Valider</button>
      </form>
    </div>
  );
};

export default UpdateFactureDetailsPage;
