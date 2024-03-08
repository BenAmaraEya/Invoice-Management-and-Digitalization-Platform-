import React, { useEffect, useState } from "react";
import axios from "axios";

const PdfViewer = ({ filename }) => {
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const response = await axios.get(`http://localhost:3006/facture/${filename}`, {
                    responseType: "blob",
                });
                const pdfUrl = URL.createObjectURL(new Blob([response.data]));
                setPdfUrl(pdfUrl);
            } catch (error) {
                console.error("Error fetching PDF:", error);
            }
        };
    
        fetchPdf();
    
        return () => {
            // Clean up when unmounting the component
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [filename]);

   

    return (
        <div>
            <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
        </div>
    );
};

export default PdfViewer;
