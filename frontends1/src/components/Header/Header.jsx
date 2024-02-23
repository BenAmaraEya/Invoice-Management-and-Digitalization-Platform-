import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faKey, faSignOutAlt, faCog } from "@fortawesome/free-solid-svg-icons"; 
import "./Header.css";
import UpdatePasswordForm from "../../pages/updatePassword";
import Logout from "../../pages/logout";
const Header = () => {
  
  const userId = localStorage.getItem("userId"); 

  const handleSelectChange = (event) => {
    const selectedOption = event.target.value;
    if (selectedOption === "updatePassword") {
      // Redirect to update password page
      window.location.href = `/updatePass/${userId}`;
    } else if (selectedOption === "logout") {
      // Perform logout action
      <Logout/>
    }
  };

  return (
    <header className="header">
      <div className="navigation">
        <ul className="menu d-flex align-items-center gap-5">
          <li className="nav__item">
            <NavLink to="/home" activeClassName="active" exact>
              Home
            </NavLink>
          </li>
          <li className="nav__item">
            <NavLink to="/profile" activeClassName="active" exact>
              Profile
            </NavLink>
          </li>
          <li className="nav__item">
            <NavLink to="/about-us" activeClassName="active" exact>
              About Us
            </NavLink>
          </li>
          <li className="nav__item">
            <NavLink to="/our-space" activeClassName="active" exact>
              <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" />
              Our Space
            </NavLink>
          </li>
          <li className="nav__item">
          <div className="dropdown-content">
                <ul className="dropdown-list">
                  <li>
                    <select onChange={handleSelectChange}>
                      <option value="" disabled selected hidden>
                        Choose an action
                      </option>
                      <option value="updatePassword">Update Password</option>
                      <option value="logout"><Logout/></option>
                    </select>
                  </li>
                </ul>
              </div>
                  </li>
                  </ul>
                  </div>
       
    
    </header>
  );
};

export default Header;
