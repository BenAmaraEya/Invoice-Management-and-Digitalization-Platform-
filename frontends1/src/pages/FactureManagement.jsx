// FactureManagement.jsx
import React, { useState } from 'react';
import FactureForm from './FactureForm';
import FactureUploader from './FactureUploader';

function FactureManagement() {
  const [selectedNature, setSelectedNature] = useState('');

  return (
    <div>
      <FactureForm selectedNature={selectedNature} setSelectedNature={setSelectedNature} />
      <FactureUploader selectedNature={selectedNature} setSelectedNature={setSelectedNature} />
    </div>
  );
}

export default FactureManagement;
