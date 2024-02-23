import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./../pages/Login";
import Profil from "./../pages/ProfilTT";
import Home from "./../pages/Home";
import ListUser from "./../pages/ListUser";
import AddUser from "./../pages/AddUser";
import UpdateUser from"./../pages/UpdateUser";
import Logout from "../pages/logout";
import UpdatePasswordForm from "../pages/updatePassword";
const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout/:id" element={<Logout />} />
            <Route path="/profil/:id" element={<Profil />} />
            <Route path="/listUser" element={<ListUser />} />
            <Route path="/addUser" element={<AddUser />} />
            <Route path="/updateUser/:iderp" element={<UpdateUser />} />
            <Route path="/updatepass/:id" element={<UpdatePasswordForm />} />

        </Routes>
    );
};

export default Routers;

