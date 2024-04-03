import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';

const ArchiveViewer = () => {
  const [archives, setArchives] = useState([]);
  const [filteredArchives, setFilteredArchives] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    fetchArchives();
  }, []);

  const fetchArchives = async () => {
    try {
      const response = await axios.get('http://localhost:3006/archive');
      setArchives(response.data);
      console.log(response.data)
      setFilteredArchives(response.data); // Initially, display all archives
      const availableYears = response.data.map((archive) => archive.annee);
      setYears(Array.from(new Set(availableYears))); // Remove duplicate years
    } catch (error) {
      console.error('Error fetching archives:', error);
    }
  };

  const handleYearFilter = async () => {
    if (!selectedYear) {
      // If no year selected, display all archives
      setFilteredArchives(archives);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3006/archive/listArchive/${selectedYear}`);
      const filteredData = response.data?.Factures ? [response.data] : []; 
      setFilteredArchives(filteredData);
      console.log(filteredData);
    } catch (error) {
      console.error('Error fetching filtered archives:', error);
    }
  };


  return (
    <div>
      <h1>Archives Viewer</h1>
      <label htmlFor="yearFilter">Filter by Year:</label>
      <select
        id="yearFilter"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        <option value="">All</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <button onClick={handleYearFilter}>Filter</button>
      <table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Year</th>
      <th>Associated Factures</th>
    </tr>
  </thead>
  <tbody>
    {filteredArchives && filteredArchives.length > 0 ? (
      filteredArchives.map((archive) => (
        <tr key={archive.id}>
          <td>{archive.id}</td>
          <td>{archive.annee}</td>
          <td>
            {Array.isArray(archive.Factures) && archive.Factures.length > 0 ? (
              <ul>
                {archive.Factures.map((facture) => (
                  <li key={facture.idF}>
                    <p> <strong> Facture Numéro:</strong> {facture.num_fact} 
                    <strong> Date: </strong>{facture.date_fact}
                    <strong> iderp Fournisseur: </strong>{facture.iderp}
                    <Link to={`/detailsFacture/${facture.idF}`}>
                                    <Button>Details</Button>
                                </Link>
                                </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No associated factures.</p>
            )}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="3">No archives found.</td>
      </tr>
    )}
  </tbody>
</table>


    </div>
  );
};

export default ArchiveViewer;
