import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Button, Card, CardImg, CardBody, CardTitle } from "reactstrap";
import axios from 'axios';
import { FaTrash } from 'react-icons/fa'; // Import the trash icon
import { Document, Page } from 'react-pdf';

const Dashboard = () => {
    const navigate = useNavigate();
    const [factures, setFactures] = useState([]);
    const [iderp, setIdErp] = useState(null);
    const [pdfPath, setPdfPath] = useState(null);

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

    const deleteFacture = async (fournisseurId, factureId) => {
        try {
            const response = await axios.delete(`http://localhost:3006/facture/fournisseur/${fournisseurId}/facture/${factureId}`);
            if (response.data.success) {
                // If deletion is successful, update the factures list
                setFactures(factures.filter(facture => facture.idF !== factureId));
                console.log(response.data.message);
            }
        } catch (error) {
            console.error('Error deleting facture:', error);
        }
    };

    const openPdf = (path) => {
        setPdfPath(path);
    };

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
                            <th>Action</th> 
                            <th>PDF</th> 
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
                                <td>
                                    <button onClick={() => deleteFacture(facture.iderp, facture.idF)}>
                                        <FaTrash /> 
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => openPdf(facture.pathpdf)}>View PDF</button>
                                </td>
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
            {pdfPath && (
                <div style={{ width: '100%', height: '500px' }}>
                    <Document file={pdfPath}>
                        <Page pageNumber={1} width={600} />
                    </Document>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
