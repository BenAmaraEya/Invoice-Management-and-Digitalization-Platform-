import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaTrash } from 'react-icons/fa';
import { Link,useParams } from 'react-router-dom';
import { Button } from 'reactstrap';
import '../../styles/listefacture.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ListeFactures = () => {
    
    
    const [pdfPath, setPdfPath] = useState(null);
   
        const [factures, setFactures] = useState([]);
        const [loading, setLoading] = useState(true);
        const { iderp } = useParams(); 
    
        useEffect(() => {
            const fetchFactures = async () => {
                try {
                    const response = await axios.get(`http://localhost:3006/facture/${iderp}`);
                    setFactures(response.data.factures);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching factures:', error);
                    setLoading(false);
                }
            };
    
            fetchFactures();
        }, [iderp]);
    

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
                            <td></td>
                            <td>
                                <button onClick={() => viewFacturePDF(facture.pathpdf)}>View PDF</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {pdfPath && (
                <Document file={pdfPath} error="PDF loading error">
                    <Page pageNumber={1} />
                </Document>
            )}
        </div>
    );
};

export default ListeFactures;
