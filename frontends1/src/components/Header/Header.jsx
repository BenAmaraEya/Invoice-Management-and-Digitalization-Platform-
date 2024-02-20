import React from "react";
import { Container, Row } from "reactstrap";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

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
  return (
    <header className="header">
      <Container>
        <Row>
          <div className="nav__wrapper d-flex align-items-center justify-content-between">
            <div className="navigation">
              <ul className="menu d-flex align-items-center gap-5">
                {nav_links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      activeClassName="active" exact>
                      {item.display}
                      {item.icon && (
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="icon"
                        />
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="nav_right d-flex align-item-center gap-4"></div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
