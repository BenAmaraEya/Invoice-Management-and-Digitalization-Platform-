import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaTrash } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { Button } from 'reactstrap';
import '../../styles/listefacture.css';

pdfjs.GlobalWorkerOptions.workerSrc = `cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ListeFacturesFiscalité = () => {
    const [pdfPath, setPdfPath] = useState(null);
    const [motifRejete, setMotifRejete] = useState(''); 
    const [motifsRejete, setMotifsRejete] = useState({});
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

    const validerFiscalité = async (idF) => {
        try {
            
            await axios.put(`http://localhost:3006/facture/validerfiscalite/${idF}`);
            window.location.href = window.location.href;
        } catch (error) {
            console.error('Error valide document: ', error);
        }
    };

    const rejeteDocument = async (idF, motifRejete) => {
        try {
            await axios.put(`http://localhost:3006/facture/rejeteCourrier/${idF}`, { motifRejete });
            setMotifsRejete(prevState => ({ ...prevState, [idF]: motifRejete }));
            window.location.reload();
        } catch (error) {
            console.error('Error rejete document: ', error);
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
                        <th>valider</th>
                        <th>Rejete</th>
                    </tr>
                </thead>
                <tbody>
    {factures
        .filter(facture => facture.status.includes('courrier validé par BOF') || facture.status.includes('courrier validé par Personnel fiscalité')|| facture.status.includes('Id Fiscale Invalide') || facture.status.includes('Manque de ') 
        
) // Filter to include only factures with BOF validation status
        .map((facture) => (
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
                <td>
                    <button className='btn' onClick={() => validerFiscalité(facture.idF)}>valider</button>
                </td>
                <td>
                    <select 
                        name="status" 
                        value={motifsRejete[facture.idF] || ''} 
                        onChange={(e) => rejeteDocument(facture.idF, e.target.value)}>
                        <option value="">Choisir motif de rejet</option>
                        <option value="Id Fiscale Invalide">Id Fiscale Invalide </option>
                        <option value="Manque BL">Manque BL</option>
                        <option value="Manque fiche de présences">Manque fiche de présences</option>
                        <option value="Manque copie du PO">Manque copie du PO</option>
                    </select>
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

export default ListeFacturesFiscalité;