import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup, Button, Card, CardImg } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import partener1 from "../assets/images/chakira cable.jpeg";
import partener2 from "../assets/images/TTlogo.png"
const Home = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.id]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3006/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      const { token, id, profil } = data;

      // Store the token and user ID in local storage
      localStorage.setItem("accessToken",token);
      localStorage.setItem("userId", id);
      localStorage.setItem("userProfil",profil);
      console.log("User ID:", id);
      console.log("Response Data:", data);
      console.log("profil", profil);
      if (profil === "fournisseur") {
        navigate(`/dashboard/${id}`);
      } else if (profil === "bof"||profil==="personnelfiscalite" ||profil==="agentTresorerie") {
        navigate(`/dashboardP/${id}`);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col lg="8" className="m-auto">
          <div className="content-container">
            <div className="left-content">
              <h2>Effortless Invoice Digitalization.</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Commodi nobis ad temporibus!In ratione magnam et.
                Voluptate tenetur minima, esse quidem odio
                deleniti facere, ipsum eos,quasi perferendis eligendi enim..
              </p>
            </div>
            <div className="right-content">
              <div className="login__container d-flex justify-content-between">
                <div className="login__form">
                  <Form onSubmit={handleLogin}>
                    <FormGroup>
                      <label>Utilisateur </label>
                      <input
                        type="text"
                        placeholder="Entez votre nom "
                        required
                        id="username"
                        onChange={handleInputChange}
                        className="custom-placeholder"
                      />
                    </FormGroup>
                    <FormGroup>
                      <label>Mot de Passe</label>
                      <input
                        type="password"
                        placeholder="Votre mot de passe"
                        required
                        id="password"
                        onChange={handleInputChange}
                        className="custom-placeholder"
                      />
                    </FormGroup>
                    <Button
                      className="btn secondary__btn auth__btn"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </Form>
                  {error && <p className="error-message">{error}</p>}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg="12">
          <div className="partners">
            <h2>Nos Partenaires</h2>
            <div className="gallery">
              <Card className="partner-card">
                <CardImg src={partener1} alt="partner 1" />
              </Card>
              <Card className="partner-card">
                <CardImg src={partener2} alt="partner 2" />
              </Card>
              <Card className="partner-card">
                <CardImg src={partener2} alt="partner 2" />
              </Card>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
