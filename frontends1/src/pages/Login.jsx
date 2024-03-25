import React, { useState,useParams } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const [user ,setUser]=useState([]);
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
        const { token, id,profil } = data;
       
        
      // Store the token and user ID in local storage
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("userId", id);
      localStorage.setItem("profil",profil);

      console.log("User ID:", id);
      console.log("Response Data:", data);
      console.log("profil",profil);
      if (profil === 'fournisseur') {
        navigate(`/dashboard/${id}`);
      } else if (profil === 'bof') {
        navigate(`/dashboardP/${id}`);
      }else if(profil === 'agentTresorerie'){
        navigate(`/dashboardP/${id}`);
      }else if(profil === 'personnelfiscalite'){
        navigate(`/dashboardP/${id}`);
      }
        
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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
                    <label>Username</label>
                    <input
                      type="text"
                      placeholder="Enter Your name"
                      required
                      id="username"
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label>Password</label>
                    <input
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
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
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
