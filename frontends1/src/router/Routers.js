import React from "react";
import { Routes, Route, Navigate, Switch } from "react-router-dom"; // Import Switch
import Login from "./../pages/Login";
import Dashboard from "./../pages/Dashboard";
import Home from "./../pages/Home";
import ListUser from "./../pages/ListUser";
import AddUser from "./../pages/AddUser";
import UpdateUser from "./../pages/UpdateUser";
import Logout from "../pages/logout";
import UpdatePasswordForm from "../pages/updatePassword";
import UploadFacture from "../pages/UploadFacture";
import FactureForm from "../pages/FactureForm";
import PdfViewer from "../pages/PdfViewer";
import ListeFactures from "../pages/ListeFactures";
import UpdateFacture from "../pages/UpdateFacture";
import DashboardP from "../pages/personnelDCF/DashboardP";
import ListCourries from "../pages/personnelDCF/ListCourriers";
import ListFournisseur from "../pages/personnelDCF/ListFournisseur";
const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout/:id" element={<Logout />} />
            <Route path="/dashboard/:id" element={<Dashboard />} />
            <Route path="/listUser" element={<ListUser />} />
            <Route path="/addUser" element={<AddUser />} />
            <Route path="/updateUser/:iderp" element={<UpdateUser />} />
            <Route path="/updatepass/:id" element={<UpdatePasswordForm />} />
            <Route path="/uploadfacture" element={<UploadFacture />} />   
            <Route path="/facture-form" element={<FactureForm />} />
            <Route path="/pdf/:filename" element={<PdfViewer />} /> 
            <Route path="/factures/:id" element={<ListeFactures />} /> 
            <Route path="/updatefacture/:idF" element={<UpdateFacture />} /> 
            <Route path="/dashboardP/:id" element={<DashboardP/>}/>
            <Route path="/listcourriers/:iderp" element={<ListCourries/>}/>
            <Route path="/listfournisseur/:id" element={<ListFournisseur/>}/>
        </Routes>
    );
};

export default Routers;
