import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faSignOutAlt, faCog } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import logo from '../../assets/images/TTlogo.png';
const Header = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleUpdatePassword = () => {
    navigate(`/updatePass/${userId}`);
    setIsMenuOpen(false); // Close the menu after selecting an option
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
    setIsMenuOpen(false); // Close the menu after selecting an option
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
          <li className="nav__item">
            <NavLink to="/our-space" activeClassName="active" exact>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
              OurSpace
            </NavLink>
          </li>
          <li className="nav__item">
            <div className="dropdown">
              <div className="dropdown-btn" onClick={handleToggleMenu}>
                <FontAwesomeIcon icon={faCog} className="icon" />
              </div>
              {isMenuOpen && (
                <div className="dropdown-content">
                  <button className="dropdown-item" onClick={handleUpdatePassword}>
                    
                    <span>Update Password</span>
                  </button>
                  <button className="dropdown-item" onClick={handleLogout}>
                    
                    <span>Logout</span>
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
