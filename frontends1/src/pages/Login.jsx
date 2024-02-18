import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.id]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3006/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();

      // Set token in local storage for future requests
      localStorage.setItem("accessToken", data.token);
      navigate('/ProfilTT');
    
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__form">
                
                <Form onSubmit={handleLogin}>
                  <FormGroup>
                    <label>username</label>
                    <input
                      type="text"
                      placeholder="Enter Your name"
                      required
                      id="username"
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>password</label><input
                      type="password"
                      placeholder="Password"
                      required
                      id="password"
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <Button
                    className="btn secondary__btn auth__btn"
                    type="submit"
                  >
                    Login
                  </Button>
                </Form>
                {error && <p className="error-message">{error}</p>}
                
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;
