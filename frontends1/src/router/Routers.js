import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./../pages/Login";
import Profil from "./../pages/ProfilTT";
import Home from "./../pages/Home"
const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/Home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path='/profil' element={<Profil />} />
        </Routes>
    );
};

export default Routers;
