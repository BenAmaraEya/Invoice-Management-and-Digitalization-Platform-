import React, { useEffect, useState } from "react";
import axios from "axios";

const PdfViewer = ({ pdfPath }) => {
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const response = await axios.get(`http://localhost:3006/${pdfPath}`, {
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
            // Clean up resources
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfPath]);

    return (
        <div>
            {pdfUrl ? (
                <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
            ) : (
                <p>Loading PDF...</p>
            )}
        </div>
    );
};

export default PdfViewer;
