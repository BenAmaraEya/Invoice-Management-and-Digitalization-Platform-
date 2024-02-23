// Logout.js

import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3006/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // No need to send user ID for logout
      });

      if (response.ok) {
        // Clear local storage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        navigate('/login');
      } else {
        console.error("Failed to logout:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
