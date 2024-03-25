import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams ,useNavigate} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/updatefacture.css';
const UpdateFactureDetailsPage = () => {
  const { idF } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
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
    piece_name: [], // Ajoutez le state pour les pièces jointes sélectionnées
  });

  useEffect(() => {
    const fetchFactureDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3006/facture/facturebyId/${idF}`);
        const fetchedFacture = response.data.facture;
        console.log(fetchedFacture);
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
            piece_name: fetchedFacture.Pieces_jointes.map(piece => piece.piece_name) || [], // Récupère les noms des pièces jointes existantes
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

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    if (name === 'piece_name') {
      const updatedPieces = checked
        ? [...facture.piece_name, value] // Ajoute la pièce jointe sélectionnée
        : facture.piece_name.filter(piece => piece !== value); // Retire la pièce jointe désélectionnée
      setFacture(prevFacture => ({
        ...prevFacture,
        piece_name: updatedPieces,
      }));
    } else {
      setFacture(prevFacture => ({
        ...prevFacture,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      //update facture
      const token = localStorage.getItem('accessToken');
      await axios.put(`http://localhost:3006/facture/updateFacture/${idF}`, facture,{
        headers: {
         
          Authorization: `Bearer ${token}`
        }
      });
      alert('Facture details updated successfully');

      // Update pieces jointes
      await axios.put(`http://localhost:3006/piecejoint/updatepiece/${idF}`,{
        piece_name: facture.piece_name},{
          headers: {
         
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert('Pieces jointes updated successfully');
      navigate(`/factures/${facture.iderp}`);
    } catch (error) {
      console.error('Error updating facture and pieces jointes:', error);
      alert('Failed to update facture and pieces jointes');
    }
  };
  const handleDateChange = (date) => {
    setFacture(prevFacture => ({
      ...prevFacture,
      date_fact: date,
      datereception:date
    }));
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
    <section>
    <Container>
      <Row>
        <Col lg="8" className="m-auto">
    
      <h1>Modifier Facture </h1>
      <div className="facture-container d-flex justify-content-between">
              <div className="facture-form">
      <form onSubmit={handleSubmit}>
      <Row>
                    <Col md="6">
                      <FormGroup>
        <label>
          Numéro de Facture:
          <input type="text" name="num_fact" value={facture.num_fact} onChange={handleChange} required />
        </label>
        </FormGroup>
                      <FormGroup>
        <label>
          Numéro PO:
          <input type="text" name="num_po" value={facture.num_po} onChange={handleChange} />
        </label>
        </FormGroup>
                      <FormGroup>
        <label>
          Date de facture:
          <DatePicker selected={facture.date_fact} onChange={handleDateChange} />        </label>
          </FormGroup>
          
                      <FormGroup>
        <label>
          Montant:
          <input type="number" name="montant" value={facture.montant} onChange={handleChange} required />
        </label>
        </FormGroup>
                      <FormGroup>
        <label>
          Nom de Facture:
          <input type="text" name="factname" value={facture.factname} onChange={handleChange} required />
        </label>
        </FormGroup>
                      <FormGroup>
        <label>
          Devise:
          <select name="devise" value={facture.devise} onChange={handleChange} required>
            <option value="TND">TND</option>
            <option value="EURO">EURO</option>
            <option value="USD">USD</option>
          </select>
        </label>
        </FormGroup>
        </Col>
                    <Col md="6">
                      <FormGroup>
        <label>
          Nature:
          <input type="text" name="nature" value={facture.nature} onChange={handleChange} required />
        </label>
        </FormGroup>
                      <FormGroup>
        <label>
          Objet:
          <input type="text" name="objet" value={facture.objet} onChange={handleChange} required />
        </label>
        </FormGroup>
                      <FormGroup>
        <label>
          Date de Réception:
          <DatePicker selected={facture.datereception} onChange={handleDateChange} />         </label>
          </FormGroup>
                   
                      <FormGroup>
  <label>
    Pièces Jointes :
    <div>
      <label>
        <input
          type="checkbox"
          name="piece_name"
          value="bon de command"
          checked={facture.piece_name.includes('bon de command')}
          onChange={handleChange}
        />
        Bon de Commande
      </label>
    </div>
    <div>
      <label>
        <input
          type="checkbox"
          name="piece_name"
          value="pv de reception"
          checked={facture.piece_name.includes('pv de reception')}
          onChange={handleChange}
        />
        PV de Reception
      </label>
    </div>
  </label>
</FormGroup>

                      <FormGroup>
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
        </FormGroup>
        </Col>
                  </Row>
                  <div className='btn-container'>
        <button type="submit">Valider</button>
        </div>
      </form>
      </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default UpdateFactureDetailsPage;
