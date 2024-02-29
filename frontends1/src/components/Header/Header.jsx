import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faKey, faSignOutAlt, faCog } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleSelectChange = async (event) => {
    const selectedOption = event.target.value;
    if (selectedOption === "updatePassword") {
      // Redirect to update password page
      navigate(`/updatePass/${userId}`);
    } else if (selectedOption === "logout") {
      // Perform logout action
      try {
        const response = await fetch(`http://localhost:3006/auth/logout/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          // Clear local storage
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userId");
          console.log("token removed");
          navigate('/login');
        } else {
          console.error("Failed to logout:", response.statusText);
        }
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }
  };

  const handleLanguageChange = (language) => {
    // Implement logic to handle language change
    console.log('Selected language:', language);
    // You can add code here to change the language in your application
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
                    <option value="logout">Logout</option>
                  </select>
                </li>
              </ul>
            </div>
          </li>
          <li className="nav__item">
            {/* Include LanguageSelector component here */}
            <LanguageSelector onChangeLanguage={handleLanguageChange} />
          </li>
        </ul>
      </div>
    </header>
  );
};

function LanguageSelector({ onChangeLanguage }) {
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default language is English

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    onChangeLanguage(language); // Call the parent component's function to handle language change
  };

  return (
    <div>
      <span className={`icon ${selectedLanguage === 'en' ? 'active' : ''}`} onClick={() => handleLanguageChange('en')}>
        <i className="fas fa-globe"></i> {/* Globe icon for English */}
      </span>
      <span className={`icon ${selectedLanguage === 'fr' ? 'active' : ''}`} onClick={() => handleLanguageChange('fr')}>
        <i className="fas fa-globe"></i> {/* Globe icon for French */}
      </span>
      {/* Add more icons for other languages */}
    </div>
  );
}

export default Header;
