import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faSignOutAlt, faCog, faBell } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import logo from '../../assets/images/TTlogo.png';
import io from 'socket.io-client';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import NotificationBadge, { Effect } from 'react-notification-badge';

const Header = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userProfile = localStorage.getItem("userProfil");
  const [isBordereauMenuOpen, setIsBordereauMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [fournisseur, setFournisseur] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:3006');

    socket.on('newReclamation', async (reclamation) => {
      try {
        const response = await axios.get('http://localhost:3006/fournisseur/');
        setFournisseur(response.data);

        // Add new notification to the array
        setNotifications(prevNotifications => [
          ...prevNotifications,
          {
            id: reclamation.id,
            message: `Nouvelle réclamation`
          }
        ]);
      } catch (error) {
        console.error("Error fetching fournisseur:", error);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleToggleBordereauMenu = () => {
    setIsBordereauMenuOpen(!isBordereauMenuOpen);
  };

  const handleToggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleToggleNotificationMenu = () => {
    setIsNotificationMenuOpen(!isNotificationMenuOpen);
  };

  const handleNatureSelection = (nature) => {
    navigate('/uploadFact/' + nature, { state: { nature } });
    setIsBordereauMenuOpen(false); // Close the menu after selecting a nature
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
      <div className="logo-container">
        <img src={logo} alt="" className="logo" />
      </div>
      <div className="navigation">
        <ul className="menu d-flex align-items-center gap-5">

          <li className="nav__item">
            <NavLink to="/home" activeClassName="active" exact>
              Accueil
            </NavLink>
          </li>

          <li className="nav__item">
            <NavLink to={`/dashboardP/${userId}`} activeClassName="active" exact>
              Dashboard
            </NavLink>
          </li>
          <li className="nav__item">
            <NavLink to={`/listfournisseur/${userId}`} activeClassName="active" exact>
              Fournisseurs
            </NavLink>
          </li>

         
          {userProfile === "bof" && (
            <>
              <li className="nav__item bordereau-item">
                <div className="dropdown">
                  <div className="dropdown-btn" onClick={handleToggleBordereauMenu} activeClassName="active" exact>
                    deposer
                  </div>
                  {isBordereauMenuOpen && (
                    <div className="dropdown-content">
                      <button className="dropdown-item" onClick={() => handleNatureSelection('3WMTND')}>
                        TND
                      </button>
                      <button className="dropdown-item" onClick={() => handleNatureSelection('Nature2')}>
                        Nature 2
                      </button>
                    </div>
                  )}
                </div>
              </li>
              <li className="nav__item">
                <NavLink to={`/bordereaux`} activeClassName="active" exact>
                  Bordereaux
                </NavLink>
              </li>
            </>
          )}

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
          <li className="nav__item">
            <div className="dropdown">
              <div className="dropdown-btn" onClick={handleToggleNotificationMenu}>
                
              <FontAwesomeIcon icon={faBell} className="notif-icon" />
              {notifications.length > 0 && (
      <div className="notification-badge-container">
      <NotificationBadge count={notifications.length} effect={Effect.SCALE} />
    </div>
    )}
              
              </div>
              {isNotificationMenuOpen && (
                <div className="dropdown-content">
                  {notifications.length === 0 ? (
                    <div>Pas de nouveau notification</div>
                  ) : (
                    notifications.map(notification => (
                      <div key={notification.id} onClick={() => {
                        navigate(`/reclam/${notification.id}`);
                        NotificationManager.info(notification.message);
                        setNotifications(notifications.filter(n => n.id !== notification.id));
                        localStorage.setItem("notifications", JSON.stringify(notifications.filter(n => n.id !== notification.id)));
                      }} className="notification-item">
                        {notification.message}
                      </div>
                    ))
                  )}
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
