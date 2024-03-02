import React, { useState } from 'react';
import axios from 'axios';

function FactureUploader() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [factureInfo, setFactureInfo] = useState(null);
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
      setFactureInfo(response.data.extractedInfo);
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
      {factureInfo && (
        <div>
          <h3>Extracted Information:</h3>
          <p>Numéro de facture: {factureInfo.num_fact}</p>
          <p>Date de facture: {factureInfo.date_fact}</p>
          <p>Montant: {factureInfo.montant}</p>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default FactureUploader;