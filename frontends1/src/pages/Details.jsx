import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
const Details = () => {
    const { idF } = useParams();
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
        piece_name: [],
        etat:[] // Ajoutez le state pour les pièces jointes sélectionnées
      });
      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:3006/facture/facturebyId/${idF}`);
            setFacture(response.data.facture); 
            console.log(response.data);
          } catch (error) {
            console.error('Error fetching facture:', error);
          }
        };
      
        if (idF) {
          fetchData(); 
        }
      }, [idF]);
    const viewFacturePDF = async (pathpdf) => {
        try {
            const response = await axios.get(`http://localhost:3006/facture/view-pdf/${pathpdf}`, {
                responseType: 'blob'
            });
            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl);
        } catch (error) {
            console.error('Error viewing facture PDF:', error);
        }
    };

    return (
        <div>
          <h1>Details Facture {facture.idF}</h1>
          <table>
            <thead>
              <tr>
                <th>Numéro Facture</th>
                <th>Nature</th>
                <th>Date Facture</th>
                <th>Numéro de bon commande</th>
                <th>Montant</th>
                <th>Devise</th>
                <th>Date de Réception</th>
                <th>View PDF</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{facture.num_fact}</td>
                <td>{facture.nature}</td>
                <td>{facture.date_fact}</td>
                <td>{facture.num_po}</td>
                <td>{facture.montant}</td>
                <td>{facture.devise}</td>
                <td>{facture.datereception}</td>

                <td>
                  <button onClick={() => viewFacturePDF(facture.pathpdf)}>View PDF</button>
                </td>
              </tr>
            </tbody>
          </table>
    <h4>Pieces Jointes</h4>
          <ul>
  {facture.Pieces_jointes && facture.Pieces_jointes.map((piece, index) => (
    <li key={index}>{piece.piece_name}</li>
  ))}
</ul>
<h4>Historique Etat du Facture</h4>
<ul>
  {facture.Etats && facture.Etats.map((etat) => (
    <li key={etat.id}>{etat.etat} ({etat.date})</li>
    ))}
</ul>
        </div>
      );
};
export default Details;
