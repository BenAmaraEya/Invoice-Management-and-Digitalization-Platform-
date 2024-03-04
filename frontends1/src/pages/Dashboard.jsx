import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Button,Card, CardImg, CardBody, CardTitle } from "reactstrap";
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [factures, setFactures] = useState([]);
  const [iderp, setIdErp] = useState(null);

  useEffect(() => {
    const fetchFournisseurByUserId = async () => {
      try {
        const id = localStorage.getItem("userId");
        const response = await axios.get(`http://localhost:3006/fournisseur/userId/` + id);
        const iderpFromResponse = response.data.fournisseur.iderp;
        setIdErp(iderpFromResponse);
      } catch (error) {
        console.error('Error fetching fournisseur:', error);
      }
    };

    fetchFournisseurByUserId();
  }, []);

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        if (iderp) {
          const response = await axios.get(`http://localhost:3006/facture/${iderp}`);
          setFactures(response.data.factures);
        }
      } catch (error) {
        console.error('Error fetching factures:', error);
      }
    };

    fetchFactures();
  }, [iderp]);

  return (
    <div>
      
      <div>
        
        <table>
          <thead>
            <tr>
              <th>Facture ID</th>
              <th>Numéro Facture</th>
              <th>Facture Name</th>
              <th>Montant</th>
              <th>Status</th>
              <th>Numéro PO</th>
              <th>Date Facture</th>
             
              
            </tr>
          </thead>
          <tbody>
           
            {factures.map((facture) => (
              <tr key={facture.idF}>
                <td>{facture.idF}</td>
                <td>{facture.num_fact}</td>
                <td>{facture.factname}</td>
                <td>{facture.montant}</td>
                <td>{facture.status}</td>
                <td>{facture.num_po}</td>
                <td>{facture.date_fact}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
        <div className="btns d-flex align-item-center gap-4">
                        <Link to="/uploadFacture">
                            <Button className="btn_Ajout">Ajouter Facture</Button>
                        </Link>
                    </div> 
        
      </div>
    </div>
  );
};

export default Dashboard;
