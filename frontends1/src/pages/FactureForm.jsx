import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import '../styles/factureform.css'; //
function FactureForm() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    num_fact: '',
    date_fact: '',
    montant: '',
    factname: '',
    devise: '',
    nature: '',
    objet: ''
  });

  const extractedInfo = location.state.extractedInfo || {};

  // Initialize the form state with the extracted information
  useState(() => {
    setFormData({
      num_fact: extractedInfo.num_fact || '',
      date_fact: extractedInfo.date_fact || '',
      montant: extractedInfo.montant || '',
    });
  }, [extractedInfo]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      // Send the form data to the backend to save
      await axios.post('http://localhost:3006/facture/save', formData);

      // Log a message when the data is successfully added
      console.log('Facture data added successfully.');

      // Show an alert message when the data is added
      alert('Facture data added successfully.');

    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle errors if any
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
                    <label className="facture-label">Numéro de facture:</label>
                    <input className="facture-input" type="text" name="num_fact" value={formData.num_fact} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <label className="facture-label">Date de facture:</label>
                    <input className="facture-input" type="date" name="date_fact" value={formData.date_fact} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <label className="facture-label">Montant:</label>
                    <input className="facture-input" type="text" name="montant" value={formData.montant} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <label className="facture-label">Facture Name:</label>
                    <input className="facture-input" type="text" name="factname" value={formData.factname} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <label className="facture-label">Devise:</label>
                    <input className="facture-input" type="text" name="devise" value={formData.devise} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <label className="facture-label">Nature:</label>
                    <input className="facture-input" type="text" name="nature" value={formData.nature} onChange={handleChange} />
                  </FormGroup>
                  <FormGroup>
                    <label className="facture-label">Objet:</label>
                    <input className="facture-input" type="text" name="objet" value={formData.objet} onChange={handleChange} />
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
