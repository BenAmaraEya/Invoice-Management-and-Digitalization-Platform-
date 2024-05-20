import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import '../../styles/Archive.css'; // Import your CSS file for styling

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
    } catch (error) {
      console.error('Error fetching filtered archives:', error);
    }
  };

  return (
    <Container className="archive-viewer-container">
      <Row className="justify-content-between align-items-center mb-4">
        <Col>
          <h2 className="text-center">Archives</h2>
        </Col>
        <Col className="text-right">
          <Form inline style={{marginLeft:'50%'}}>
            <FormGroup>
              <Label for="yearFilter" className="mr-2">Filter by Year:</Label>
              <Input
                type="select"
                id="yearFilter"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="mr-2"
                style={{width:'30%'}}
              >
                <option value="">All</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Input>
              <Button  style={{background:'#688eec',color:'whitesmoke',border:'none'}}onClick={handleYearFilter}>Filter</Button>
            </FormGroup>
          </Form>
        </Col>
      </Row>

      <Table bordered hover responsive>
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
                          <p><strong>Facture Numéro:</strong> {facture.num_fact} <br />
                          <strong>Date:</strong> {facture.date_fact} <br />
                          <strong>iderp Fournisseur:</strong> {facture.iderp} <br />
                          <Link to={`/detailsFacture/${facture.idF}`}>
                            <Button  style={{background:'#688eec',color:'whitesmoke',border:'none'}} size="sm">Details</Button>
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
      </Table>
    </Container>
  );
};

export default ArchiveViewer;
