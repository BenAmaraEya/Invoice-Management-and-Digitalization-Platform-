import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FactureUploader() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('factureFile', file);

    try {
      const response = await axios.post('http://localhost:3006/facture/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Navigate to the form page with extracted information
      navigate('/facture-form', { state: { extractedInfo: response.data.extractedInfo } });
    } catch (error) {
      setError('Error uploading facture');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Facture</h2>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleSubmit} disabled={!file || loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
     
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default FactureUploader;
