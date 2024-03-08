import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Button, Card, CardImg, CardBody, CardTitle } from "reactstrap";
import axios from 'axios';
import { FaTrash, FaFileExcel } from 'react-icons/fa'; // Import the trash and excel icons
import { Document, Page } from 'react-pdf';
import PdfViewer from './PdfViewer';
const ListeFactures = () => {
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
            const token = localStorage.getItem('accessToken');
            const response = await axios.delete(`http://localhost:3006/facture/fournisseur/${fournisseurId}/facture/${factureId}`,{
                headers: {
                    
                    Authorization:`Bearer ${token}`
                   
                  }
            });
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

    const exportToExcel = async () => {
        try {
            // Get the token from localStorage
            const token = localStorage.getItem('accessToken');
    
            const response = await axios.post('http://localhost:3006/facture/export', {
                factures: factures,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: 'blob', // Set response type to blob to handle binary data
            });
    
            // Create a Blob from the response data
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'factures.xlsx');
    
            // Append the link to the body and click it to trigger the download
            document.body.appendChild(link);
            link.click();
    
            // Cleanup
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error exporting factures to Excel:', error);
        }
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
                <button onClick={exportToExcel}><FaFileExcel />Export Factures</button>
                </div>
            </div>
           
            <div style={{ width: '100%', height: '500px' }}>
                {pdfPath && <PdfViewer filename={pdfPath} />}
            </div>
          
        </div>
    );
};

export default ListeFactures;
