// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';

import Profil from './pages/ProfilTT';
const App = () => {
  return (
    <Router>
      
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path='/profilTT' element={<Profil/>}/>
        </Routes>
      
    </Router>
  );
};

export default App;
