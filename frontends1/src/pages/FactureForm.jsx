import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import '../styles/factureform.css';

function FactureForm() {
  const location = useLocation();
  const { iderp ,nature} = useParams();
  const [formData, setFormData] = useState({
    num_fact: '',
    num_po:'',
    date_fact: '',
    montant: '',
    factname: '',
    devise: 'TND',
    nature: nature,
    objet: 'NOUVELLE FACTURE',
    datereception: new Date().toISOString().split('T')[0],
    pathpdf:'',
    idfiscale: '', 
    fournisseur:'',
    delai_paiement:new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    piece_name: [], 
  });

  useEffect(() => {
    const extractedInfo = location.state.extractedInfo || {};
    const filepath = location.state.filePath || {};

    setFormData(prevData => ({
      ...prevData,
      num_fact: extractedInfo.num_fact || '',
      date_fact: extractedInfo.date_fact || '',
      montant: extractedInfo.montant || '',
      pathpdf:filepath
    }));
    
    fetchFournisseurIdFiscale();
    fetchFournisseurName();
  }, [location.state.extractedInfo]);

  const fetchFournisseurIdFiscale = async () => {
    try {
      const id = localStorage.getItem('userId');
      const result = await axios.get(`http://localhost:3006/fournisseur/userId/` + id);
      const fournisseurIdFiscale = result.data.fournisseur.idfiscale;
      setFormData(prevData => ({
        ...prevData,
        idfiscale: fournisseurIdFiscale,
      }));
    } catch (error) {
      console.error('Error fetching fournisseur idfiscale:', error);
    }
  };
  const fetchFournisseurName = async () => {
    try {
      const id = localStorage.getItem('userId');
      const result = await axios.get(`http://localhost:3006/user/` + id);
      
      if (result.data && result.data.name) {
        const fournisseur = result.data.name;
        setFormData(prevData => ({
          ...prevData,
          fournisseur: fournisseur,
        }));
      } else {
        console.error('User object not found in the response');
      }
    } catch (error) {
      console.error('Error fetching fournisseur name:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // If it's a piece_name, toggle the checkbox selection
    if (name === 'piece_name') {
      const isChecked = formData.piece_name.includes(value);
      setFormData(prevData => ({
        ...prevData,
        piece_name: isChecked ? prevData.piece_name.filter(item => item !== value) : [...prevData.piece_name, value],
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    try {
      console.log('Form data before submission:', formData);
      const id = localStorage.getItem("userId");
      const token =localStorage.getItem('accessToken');
      const result = await axios.get(`http://localhost:3006/fournisseur/userId/` + id);
      const fournisseurIdFiscal = result.data.fournisseur.idfiscale;
      setFormData(prevData => ({
        ...prevData,
        idfiscale: fournisseurIdFiscal,
      }));
      let iderp = result.data.fournisseur.iderp;

      const response=await axios.post(`http://localhost:3006/facture/save/` + iderp, formData,{
        headers: {
          
          Authorization:`Bearer ${token}`
         
        }
      });
      
      console.log('Facture data added successfully.');
      alert('Facture data added successfully.');
      const factureId = response.data.facture.idF; // Extract the facture ID from the response
    console.log('Facture ID:', factureId);

    // Create an object containing the piece name and the facture ID
    const requestData = {
      piece_name: formData.piece_name,
      idFacture: factureId,
    };

    
    await axios.post('http://localhost:3006/piecejoint/addpiece', requestData);
  
    console.log('Piece joint added successfully.');
    alert('Piece joint added successfully.');


    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <p className='form-paragraph'>Vérifiez et complétez votre formulaire attentivement avant de soumettre.</p>
            <div className="facture-container d-flex justify-content-between">
              <div className="facture-form">

                <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <label className="facture-label">Nature 3WM:*</label>
                    <input className="facture-input" type="text" name="nature" value={formData.nature} onChange={handleChange} required />
                  </FormGroup>
                  <FormGroup>
                    <label className="facture-label">Numéro PO:*</label>
                    <input className="facture-input" type="text" name="num_po" value={formData.num_po} onChange={handleChange} required  />
                  </FormGroup>
                  <FormGroup>
  <label className="facture-label">fournisseur:*</label>
  <input className="facture-input" type="text" name="name" value={formData.fournisseur} onChange={handleChange} disabled  />
</FormGroup>

 <FormGroup>
                    <label className="facture-label">ID Fiscale :*</label>
                    <input className="facture-input" type="text" name="idfiscale" value={formData.idfiscale} onChange={handleChange} disabled />
                  </FormGroup>
                  <FormGroup>
                    <label className="facture-label">Numéro de Facture:</label>
                    <input className="facture-input" type="text" name="num_fact" value={formData.num_fact} onChange={handleChange} required/>
                  </FormGroup>
                  <FormGroup>
                    <label className="facture-label">Nom de Facture:*</label>
                    <input className="facture-input" type="text" name="factname" value={formData.factname} onChange={handleChange} required/>
                  </FormGroup>
                  <FormGroup>
                    <label className="facture-label">Date de facture:*</label>
                    <input className="facture-input" type="date" name="date_fact" value={formData.date_fact} onChange={handleChange} required />
                  </FormGroup>
                  <FormGroup>
                    <label className="facture-label">Montant:*</label>
                    <input className="facture-input" type="number" name="montant" value={formData.montant} onChange={handleChange} required/>
                  </FormGroup>
                 
                  <FormGroup>
                    <label className="facture-label">Devise:*</label>
                    <select className="facture-input" name="devise" value={formData.devise} onChange={handleChange} required>
                      <option value="TND">TND</option>
                      <option value="EURO">EU</option>
                      <option value="USD">USD</option>
                    </select>
                  </FormGroup>
                 
                  <FormGroup>
  <label className="facture-label">Date de Réception*:</label>
  <input className="facture-input" type="date" name="datereception" value={formData.datereception} disabled />
</FormGroup>
                  <FormGroup>
                    <label className="facture-label">Object:*</label>
                    <select className="facture-input" name="objet" value={formData.objet} onChange={handleChange} required>
                      <option value="NOUVELLE FACTURE">Nouvelle Facture</option>
                      <option value="ancien facture">Ancien Facture</option>
                    </select>
                  </FormGroup>
                  <FormGroup>
                    <label className="facture-label">Piéces Jointes :*</label>
                   
                    <div>
                      <label>
                        <input
                          type="checkbox"
                          name="piece_name"
                          value="bon de command"
                          checked={formData.piece_name.includes('bon de command')}
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
                          checked={formData.piece_name.includes('pv de reception')}
                          onChange={handleChange}
                        />
                        PV de Reception
                      </label>
                    </div>
                  </FormGroup>
                  <FormGroup>
  <label className="facture-label">Delai de Paiement:*</label>
  <input className="facture-input" type="text" name="name" value={formData.delai_paiement} onChange={handleChange} disabled  />
</FormGroup>
                  <button className="facture-button" type="submit">Valider</button>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default FactureForm;
