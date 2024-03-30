import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import axios from 'axios';
import { FaTrash, FaFileExcel } from 'react-icons/fa';
import { Document, Page, pdfjs } from 'react-pdf';
import './../styles/listefacture.css';

//
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ListeFactures = () => {
    const [factures, setFactures] = useState([]);
    const [iderp, setIdErp] = useState(null);
    const [pdfPath, setPdfPath] = useState(null);
    const [pdfError, setPdfError] = useState(null);

    useEffect(() => {
        const fetchFournisseurByUserId = async () => {
            try {
                const id = localStorage.getItem('userId');
                const response = await axios.get(`http://localhost:3006/fournisseur/userId/${id}`);
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
            const response = await axios.delete(`http://localhost:3006/facture/fournisseur/${fournisseurId}/facture/${factureId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setFactures(factures.filter(facture => facture.idF !== factureId));
                console.log(response.data.message);
            }
        } catch (error) {
            console.error('Error deleting facture:', error);
        }
    };

   /* const openPdf = async (facture) => {
        try {
            const pdfPath = facture.pathpdf;
            setPdfPath(pdfPath);
            setPdfError(null);
        } catch (error) {
            console.error('Error fetching PDF:', error);
            setPdfError('Error fetching PDF');
        }
    };
*/const viewFacturePDF = async (pathpdf) => {
    try {
        const response = await axios.get(`http://localhost:3006/facture/view-pdf/${pathpdf}`, {
            responseType: 'blob' //specifier le type de réponse 
        });
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);// Crée une URL objet à partir du blob, qui peut être utilisée pour accéder au contenu du blob dans le navigateur.
        window.open(pdfUrl); // ouvrir une nouvelle fenêtre
    } catch (error) {
        console.error('Error viewing facture PDF:', error);
    }
};
    const exportToExcel = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post('http://localhost:3006/facture/export', {
                factures: factures,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: 'blob',
            });

           // Créer un objet Blob à partir des données de la réponse avec le type MIME approprié pour Excel
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Créer une URL pour l'objet Blob afin de créer un lien de téléchargement
        const url = window.URL.createObjectURL(blob);

        // Créer un élément <a> pour le lien de téléchargement
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'factures.xlsx'); // Spécifier le nom du fichier à télécharger

        // Ajouter le lien au corps du document HTML, déclencher le téléchargement, puis supprimer le lien
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link)
        } catch (error) {
            console.error('Error exporting factures to Excel:', error);
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
                            <td>
                                <button className='delete-btn' onClick={() => deleteFacture(facture.iderp, facture.idF)}>
                                    <FaTrash />
                                </button>
                               
                           
                           <Link to={`/updatefacture/${facture.idF}`}>
                                    <Button className='update-facture'>Update</Button>
                                </Link>
                           </td>
                            <td>
                            <button onClick={() => viewFacturePDF(facture.pathpdf)}>View PDF</button>
                               
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="btns d-flex align-item-center gap-4">
                <button onClick={exportToExcel}><FaFileExcel />Export Factures</button>
                <Link to='/uploadfacture'>
                    <Button className='ajouter-btn'>Ajouter Factures</Button>
                </Link>
            </div>
            
            {pdfPath && (
                <Document file={pdfPath} error="PDF loading error">
                    <Page pageNumber={1} />
                </Document>
            )}
        </div>
    );
};

export default ListeFactures;
