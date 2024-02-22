
/*const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Supprimer le token d'authentification du local storage
        localStorage.removeItem("accessToken");
        
        // Appeler la fonction pour déconnecter l'utilisateur
        await changeUserActiveStatusToFalse();
        
        // Rediriger vers la page de connexion après la déconnexion
        navigate('/login');
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    logoutUser();
  }, [navigate]);

  const changeUserActiveStatusToFalse = async () => {
    try {
      await fetch("http://localhost:3006/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("User deactivated successfully");
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

  return null;
};

export default Logout;*/
// api.js
// Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Supprimer le token d'authentification du local storage
        localStorage.removeItem("accessToken");

        // Rediriger vers la page de connexion après la déconnexion
        navigate('/login');
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    logoutUser();
  }, [navigate]);

  return null; // Your Logout component should return something, even if it's null
};

export default Logout;

