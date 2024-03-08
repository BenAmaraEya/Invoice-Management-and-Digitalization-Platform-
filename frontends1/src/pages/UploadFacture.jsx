import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function FactureUploader() {
  const navigate = useNavigate();
  const { nature } = useParams();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(''); // Utiliser fileName au lieu de filePath
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name); // Stocker le nom du fichier
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('factureFile', file);

    try {
      
      const response = await axios.post('http://localhost:3006/facture/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
         
        }
      });

      // Construire le chemin complet du fichier
      const filePath = `uploads/${fileName}`;

      // Navigate to the form page with extracted information
      navigate(`/facture-form/${nature}`, { state: { extractedInfo: response.data.extractedInfo, filePath: filePath } });
    
    } catch (error) {
      setError('Error uploading facture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Document</h2>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleSubmit} disabled={!file || loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
     
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default FactureUploader;
