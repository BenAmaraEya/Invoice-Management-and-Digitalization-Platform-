import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faSignOutAlt, faCog } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import logo from '../../assets/images/TTlogo.png';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [isBordereauMenuOpen, setIsBordereauMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleToggleBordereauMenu = () => {
    setIsBordereauMenuOpen(!isBordereauMenuOpen);
  };

  const handleToggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleBordereauCreation = async (nature) => {
    try {
      const response = await axios.post('http://localhost:3006/bordereaux', {
        nature: nature
      });

      if (response.data.bordereauId) {
        navigate(`/upload-facture/${response.data.bordereauId}`);
      } else {
        console.error("Bordereau ID not returned from the server");
      }
    } catch (error) {
      console.error("Error creating bordereau:", error);
    }
  };

  const handleUpdatePassword = () => {
    navigate(`/updatePass/${userId}`);
    setIsUserMenuOpen(false); // Close the menu after selecting an option
  };

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
        navigate('/login');
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
          <div className="logo">
            <img src={logo} alt="" width={100} />
          </div>
          <li className="nav__item">
            <NavLink to="/home" activeClassName="active" exact>
              Accueil
            </NavLink>
          </li>
          <li className="nav__item">
            <NavLink to={`/dashboard/${userId}`} activeClassName="active" exact>
              Dashboard
            </NavLink>
          </li>
          {/* Bordereau menu */}
          <li className="nav__item bordereau-item">
            <div className="dropdown">
              <div className="dropdown-btn" onClick={handleToggleBordereauMenu}>
                Bordereau
              </div>
              {isBordereauMenuOpen && (
                <div className="dropdown-content">
                  <button className="dropdown-item" onClick={() => handleBordereauCreation('Nature 1')}>
                    TND
                  </button>
                  <button className="dropdown-item" onClick={() => handleBordereauCreation('Nature 2')}>
                    Nature 2
                  </button>
                </div>
              )}
            </div>
          </li>
          <li className="nav__item">
            <NavLink to="/our-space" activeClassName="active" exact>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
              OurSpace
            </NavLink>
          </li>
          {/* User settings menu */}
          <li className="nav__item user-settings-item">
            <div className="dropdown">
              <div className="dropdown-btn" onClick={handleToggleUserMenu}>
                <FontAwesomeIcon icon={faCog} className="icon" />
              </div>
              {isUserMenuOpen && (
                <div className="dropdown-content">
                  <button className="dropdown-item" onClick={handleUpdatePassword}>
                    Update Password
                  </button>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
