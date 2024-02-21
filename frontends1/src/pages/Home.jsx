import React from "react";
import Logo from "../assets/images/TTlogo.png";
import partener1 from "../assets/images/chakira cable.jpeg";
import { Container, Button,Card, CardImg, CardBody, CardTitle } from "reactstrap";
import { NavLink, Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
    return (
        <Container>
            <div className="content-container">
                <div className="left-content">
                    <h2>Effortless Invoice<br />Digitalization.</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.<br />
                        Commodi nobis ad temporibus!In ratione magnam et.<br />
                        Voluptate tenetur minima, esse quidem odio <br />
                        deleniti facere, ipsum eos,quasi perferendis eligendi enim..
                    </p>
                    <div className="btns d-flex align-item-center gap-4">
                        <Link to="/login">
                            <Button className="btn_login">login !</Button>
                        </Link>
                    </div> 
                </div>
                <div className="right-content">
                    <img src={Logo} alt="TT logo" />
                </div>
            </div>
            <div className="partners">
                <h2>Our Partners</h2>
                <div className="gallery">
                    <Card className="partner-card">
                        <CardImg src={partener1} alt="partner 1" />
                    </Card>
                    <Card className="partner-card">
                        <CardImg src={Logo} alt="partner 2" />
                    </Card>
                    <Card className="partner-card">
                        <CardImg src={Logo} alt="partner 2" />
                    </Card>
                   
                </div>
            </div>
               
            
        </Container>
    );
};

export default Home;
