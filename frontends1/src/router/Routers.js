import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./../pages/Login";
import Profil from "./../pages/ProfilTT";
import Home from "./../pages/Home";
import ListUser from "./../pages/ListUser";
import AddUser from "./../pages/AddUser";
import UpdateUser from"./../pages/UpdateUser";
const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/listUser" element={<ListUser />} />
            <Route path="/addUser" element={<AddUser />} />
            <Route path="/updateUser/:id" element={<UpdateUser />} />


        </Routes>
    );
};

export default Routers;

