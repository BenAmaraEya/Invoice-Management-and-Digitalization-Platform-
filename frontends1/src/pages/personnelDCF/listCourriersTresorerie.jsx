import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaTrash } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { Button } from 'reactstrap';
import '../../styles/listefacture.css';
import { faC } from '@fortawesome/free-solid-svg-icons';

pdfjs.GlobalWorkerOptions.workerSrc = `cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ListeFacturesTresorerie = () => {
    const [pdfPath, setPdfPath] = useState(null);
    const [motifRejete, setMotifRejete] = useState(''); 
    const [motifsRejete, setMotifsRejete] = useState({});
    const [factures, setFactures] = useState([]);
    const [loading, setLoading] = useState(true);
    const { iderp } = useParams(); 
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchDateTerm, setSearchDateTerm] = useState('');
    const [searchResultsDate, setSearchResultsDate] = useState([]);
    const [searchParams, setSearchParams] = useState({ num_fact: '', datereception: '' });
    useEffect(() => {
        const fetchFactures = async () => {
            try {
                const response = await axios.get(`http://localhost:3006/facture`);
                setFactures(response.data.factures);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching factures:', error);
                setLoading(false);
            }
        };

        fetchFactures();
    },);

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

    const validerTresorerie = async (idF) => {
        try {
            const token=localStorage.getItem("accessToken");
            await axios.put(`http://localhost:3006/facture/validerTresorerie/${idF}`,null,
            {
                headers: {
         
                    Authorization: `Bearer ${token}`
                  }
            });
            window.location.href = window.location.href;
        } catch (error) {
            console.error('Error valide document: ', error);
        }
    };

    const rejeteDocument = async (idF, motifRejete) => {
        try {
            const token=localStorage.getItem("accessToken");
            await axios.put(`http://localhost:3006/facture/rejeteCourrier/${idF}`, { motifRejete} ,{
            headers: {
         
                Authorization: `Bearer ${token}`
           }});
            setMotifsRejete(prevState => ({ ...prevState, [idF]: motifRejete }));
            window.location.reload();
        } catch (error) {
            console.error('Error rejete document: ', error);
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
    const renderFactureTable = (factures) => (
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
                    <th>PDF</th>
                    <th>valider</th>
                    <th>Rejete</th>
                </tr>
            </thead>
            <tbody>
            {factures
        .filter(facture => facture.status.includes('courrier validé par BOF') || facture.status.includes('courrier validé par Personnel fiscalité')|| facture.status.includes('Id Fiscale Invalide') || facture.status.includes('Manque')
        ).map((facture) => (
                    <tr key={facture.idF}>
                        <td>{facture.idF}</td>
                        <td>{facture.num_fact}</td>
                        <td>{facture.factname}</td>
                        <td>{facture.montant}</td>
                        <td>{facture.status}</td>
                        <td>{facture.num_po}</td>
                        <td>{facture.date_fact}</td>
                        <td>
                            <button onClick={() => viewFacturePDF(facture.pathpdf)}>View PDF</button>
                        </td>
                        <td>
                            <button className='btn' onClick={() => validerTresorerie(facture.idF)}>valider</button>
                        </td>
                        <td>
                    <select 
                        name="status" 
                        value={motifsRejete[facture.idF] || ''} 
                        onChange={(e) => rejeteDocument(facture.idF, e.target.value)}>
                        <option value="">Choisir motif de rejet</option>
                        <option value="Facture sans TVA">Facture sans TVA</option>
                        <option value="Montant facture non comforme">Montant facture non comforme</option>
                        
                    </select>
                </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
    return (
        <div>
            <div>
                <input type="text" name="num_fact" placeholder="Numéro Facture" value={searchParams.num_fact} onChange={handleInputChange} />
                <input type="date" name="datereception" placeholder="Date de Réception (yyyy-mm-dd)" value={searchParams.datereception} onChange={handleInputChange} />
                <button onClick={rechercheFacture}>Rechercher</button>
            </div>
            {searchResults.length > 0 && (
                <div>
                    <h3>Résultats de la recherche</h3>
                    {renderFactureTable(searchResults)}
                </div>
            )}
            {searchResultsDate.length > 0 && (
                <div>
                    <h3>Résultats de la recherche</h3>
                    {renderFactureTable(searchResultsDate)}
                </div>
            )}
            {!searchResults.length > 0 && !searchResultsDate.length > 0 && (
                <div>
                    {renderFactureTable(factures)}
                    {pdfPath && (
                        <Document file={pdfPath} error="PDF loading error">
                            <Page pageNumber={1} />
                        </Document>
                    )}
                </div>
            )}
        </div>
    );
};

export default ListeFacturesTresorerie;