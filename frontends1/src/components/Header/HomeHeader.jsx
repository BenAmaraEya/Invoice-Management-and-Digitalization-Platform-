import React from "react";
import { Container, Row } from 'reactstrap';
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import "./Header.css";

const nav_links = [
    {
        path: '/home',
        display: 'Accueil'
    },
    {
        path: '/dashboard',
        display: 'Dashboard'
    },
    {
        path: 'Our space',
        display: 'Our Space',
        icon: faMapMarkerAlt
    }
];

const Header = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    const handleDashboardClick = () => {
        if (!isLoggedIn) {
            navigate('/login'); // Redirect to login page if not logged in
        }
    };

    return (
        <header className="header">
            <Container>
                <Row>
                    <div className="nav__wrapper d-flex align-items-center justify-content-between">
                        <div className="navigation">
                            <ul className="menu d-flex align-items-center gap-5">
                                {nav_links.map((item, index) => (
                                    <li className="nav__item" key={index}>
                                        {item.path === '/dashboard' && !isLoggedIn ? (
                                            <span onClick={handleDashboardClick}>{item.display}</span>
                                        ) : (
                                            <NavLink to={item.path}>
                                                {item.display}
                                                {item.icon && <FontAwesomeIcon icon={item.icon} className="icon" />}
                                            </NavLink>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="nav_right d-flex align-item-center gap-4">
                          
                        </div>
                    </div>
                </Row>
            </Container>
        </header>
    );
};

export default Header;
