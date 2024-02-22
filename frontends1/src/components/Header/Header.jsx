// Header.jsx
import React from "react";
import { NavLink ,useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import Logout from "../../pages/logout"; // Import the Logout component

const nav_links = [
  {
    path: "/home",
    display: "Home"
  },
  {
    path: "/profil",
    display: "Profil"
  },
  {
    path: "/about-us",
    display: "About us"
  },
  {
    path: "/our-space",
    display: "Our Space",
    icon: faMapMarkerAlt
  }
];

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await Logout(navigate); 
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="header">
      <div className="navigation">
        <ul className="menu d-flex align-items-center gap-5">
          {nav_links.map((item, index) => (
            <li className="nav__item" key={index}>
              <NavLink to={item.path} activeClassName="active" exact>
                {item.display}
                {item.icon && (
                  <FontAwesomeIcon icon={item.icon} className="icon" />
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="nav_right d-flex align-item-center gap-4">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;
