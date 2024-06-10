import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faBell } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import logo from '../../assets/images/TTlogo.png';
import io from 'socket.io-client';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import NotificationBadge, { Effect } from 'react-notification-badge';
import axios from 'axios';
const Header = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userProfile = localStorage.getItem("userProfil");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);


  
 
  const handleLogout = async () => {
    try {
      const response = await fetch(`http://localhost:3006/auth/logout/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        console.log("Token removed");
        navigate('/home');
      } else {
        console.error("Failed to logout:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
    setIsUserMenuOpen(false);
  };

  

  return (
    <header className="header">
      
      <div className="navigation">
        <ul className="menu d-flex align-items-center gap-5">
          <li className="nav__item" style={{marginTop:'25px'}}>
            <NavLink to={`/listSupplier`} activeClassName="active"  exact>
             Fournisseurs
            </NavLink>
          </li>
          <li className="nav__item" style={{marginTop:'25px'}}>
            <NavLink to={`/listUser`} activeClassName="active" exact>
             utilisateur
            </NavLink>
          </li>
          <li className="nav__item" style={{marginTop:'25px'}}>
            <NavLink to={`/home`} activeClassName="active" exact>
            logout
            </NavLink>
          </li>
          </ul>
          </div>
        
    </header>
  );
};

export default Header;
