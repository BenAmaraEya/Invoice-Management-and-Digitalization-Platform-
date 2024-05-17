import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import axios from 'axios';
import { FaFileExcel } from 'react-icons/fa';
import { Document, Page, pdfjs } from 'react-pdf';
import './../styles/listefacture.css';
import { FaTrash, FaPen, FaSearch, FaFilePdf } from 'react-icons/fa';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ListeFactures = () => {
    const [factures, setFactures] = useState([]);
    const [iderp, setIdErp] = useState(null);
    const [pdfPath, setPdfPath] = useState(null);
    const [pdfError, setPdfError] = useState(null);
    const [searchParams, setSearchParams] = useState({ num_fact: '', datereception: '' });

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
                    //setFactures(response.data.factures);
                    console.log(response.data.factures);
                    const factures = response.data.factures;
                    const facturesNonCloturees = factures.filter(facture => !facture.Etats.some(etat => etat.etat === 'cloture'));
                    setFactures(facturesNonCloturees);
                    console.log("facturesNonCloturees",facturesNonCloturees);
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
                alert(`Facture deleted successfully.`);
            }
        } catch (error) {
            console.error('Error deleting facture:', error);
        }
    };

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

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'factures.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error exporting factures to Excel:', error);
        }
    };

    const rechercheFacture = async () => {
        try {
            const response = await axios.get('http://localhost:3006/facture/recherche/ParDATEetNUM', {
                params: searchParams
            });
            // Handle the response data here, update state accordingly
            if (response.data) {
                // Update the factures state with the filtered facture data
                setFactures([response.data]);
            }
        } catch (error) {
            console.error('Error searching for facture:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div>
            <div style={{ position: 'relative', display: 'inline-block', marginTop:'50px', right:'-12px'}}>
                <input type="text" name="num_fact" placeholder="Numéro Facture" value={searchParams.num_fact} onChange={handleInputChange}  style={{ width: '250px',borderRadius:'5px'  }} />
                <input type="date" name="datereception" placeholder="Date de Réception (yyyy-mm-dd)" value={searchParams.datereception} onChange={handleInputChange}  style={{ width: '250px',borderRadius:'5px'  }} />
              
            </div>
            <button style={{width:'50px',background:'white',border:'1px solid lightgrey',height:'26px',position: 'relative', display: 'inline-block', marginTop:'50px', top:'-6px',right:'-12px'}}><FaSearch style={{ position: 'absolute', right: '18px', top: '50%',transform: 'translateY(-50%)', color:'black', cursor: 'pointer' }} onClick={rechercheFacture} /></button>
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
                        <th>Infographic</th>
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
                                <FaTrash style={{fontSize: '20px', backgroundColor: 'transparent' }} onClick={() => deleteFacture(facture.iderp, facture.idF)} />
                                </button>
                                {facture.status === 'Attente' || facture.status.includes('Manque') ? (
    <Link to={`/updatefacture/${facture.idF}`}>
        <FaPen color="grey" />
    </Link>
) : null}
                            </td>
                            <td>
                                <button onClick={() => viewFacturePDF(facture.pathpdf)}><FaFilePdf /></button>
                            </td>
                            <td>
              <Link to={`/infographic/${facture.idF}`}>
                View Etat
              </Link>
            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="btns d-flex align-item-center gap-4">
                <button onClick={exportToExcel}>Export Factures <FaFileExcel /></button>
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
