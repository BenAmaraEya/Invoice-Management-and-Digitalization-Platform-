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

const Header = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [notificationsEtat, setNotif] = useState([]);

  const handleToggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleUpdatePassword = () => {
    navigate(`/updatePass/${userId}`);
    setIsUserMenuOpen(false); 
  };

  const handleReclamation = () => {
    navigate(`/reclamation/${userId}`);
    setIsUserMenuOpen(false);   };

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

  useEffect(() => {
    const storedetatNotifications = JSON.parse(localStorage.getItem("notificationEtat")) || [];
    setNotif(storedetatNotifications);
    const socket = io('http://localhost:3006');
    socket.on('newStatuts', async (statut, num) => {
      try {
        const newNotification = {
          message: { statut, num }
        };
        setNotif(prevNotificationsEtat => {
          const updatedNotificationEtat = [...prevNotificationsEtat, newNotification];
          localStorage.setItem("notificationEtat", JSON.stringify(updatedNotificationEtat));
          return updatedNotificationEtat;
        });
      } catch (error) {
        console.error("Error fetching fournisseur:", error);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleToggleNotificationMenu = () => {
    setIsNotificationMenuOpen(!isNotificationMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="" className="logo" />
      </div>
      <div className="navigation">
        <ul className="menu d-flex align-items-center gap-5">
          <li className="nav__item">
            <NavLink to={`/dashboard/${userId}`} activeClassName="active" exact>
              Dashboard
            </NavLink>
          </li>
          <li className="nav__item">
            <NavLink to={`/factures/${userId}`} activeClassName="active" exact>
              Factures
            </NavLink>
          </li>
          <li className="nav__item">
            <NavLink to={`/listreclamation/${userId}`} activeClassName="active" exact>
              Réclamations
            </NavLink>
          </li>
          <li className="nav__item">
            <NavLink to={`/historique/${userId}`} activeClassName="active" exact>
              Historique
            </NavLink>
          </li>
          <li className="nav__item user-settings-item">
            <div className="dropdown">
              <div className="dropdown-btn" onClick={handleToggleUserMenu}>
                <FontAwesomeIcon icon={faCog} className="icon" />
              </div>
              {isUserMenuOpen && (
                <div className="dropdown-content">
                  <button className="dropdown-item" onClick={handleReclamation}>
                    Réclamations
                  </button>
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
                {notificationsEtat.length > 0 && (
                  <div className="notification-badge-container">
                    <NotificationBadge count={notificationsEtat.length} effect={Effect.SCALE} />
                  </div>
                )}
              </div>
              {isNotificationMenuOpen && (
                <div className="dropdown-content">
                  {notificationsEtat.length === 0 ? (
                    <div>Pas de nouveau notification</div>
                  ) : (
                    notificationsEtat.map((notif, index) => (
                      <div key={index} onClick={() => {
                        NotificationManager.info(notif.message.statut.statuts);
                        setNotif(notificationsEtat.filter(n => n.id !== index));
                        localStorage.setItem("notificationEtat", JSON.stringify(notificationsEtat.filter(n => n.id !== index)));
                      }} className="notification-item">
                        N°: {notif.message.statut.num} - {notif.message.statut.statuts}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </li>
        </ul>
      </div>
      <NotificationContainer />
    </header>
  );
};

export default Header;
