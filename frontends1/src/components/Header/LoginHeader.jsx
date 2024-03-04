import React from "react";
import { Container, Row } from 'reactstrap'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/images/TTlogo.png';

const Header = () => {
    

    return (
        <header className="header">
                    
                    
                        <div className="logo">
                            <Link to="/home">
                                <img src={logo} alt="" width={100} />
                            </Link>
                        </div>
                                   
                  
        </header>
    );
};

export default Header;
