import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa"; // Importing user and lock icons
import "../styles/Home.css";

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
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userId", id);
      localStorage.setItem("userProfil", profil);

      if (profil === "fournisseur") {
        navigate(`/dashboard/${id}`);
      } else if (profil === "bof" || profil === "personnelfiscalite" || profil === "agentTresorerie") {
        navigate(`/dashboardP/${id}`);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="full-page-background">
      <Container className="content-container">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md="6" className="login__container">
            <div className="login__header">
              <div className="login__icon"><FaUser /></div>
            </div>
            <Form onSubmit={handleLogin}>
              <FormGroup>
                <label className="labels" htmlFor="username"><FaUser /> Email ID</label>
                <input
                  type="text"
                  placeholder="Enter your email"
                  required
                  id="username"
                  onChange={handleInputChange}
                  className="custom-input"
                />
              </FormGroup>
              <FormGroup>
                <label className="labels"  htmlFor="password"><FaLock /> Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  required
                  id="password"
                  onChange={handleInputChange}
                  className="custom-input"
                />
              </FormGroup>
              <Button
                className="auth__btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <div className="login__options">
                <input type="checkbox" id="rememberMe" /> <label htmlFor="rememberMe">Remember me</label>
                <a href="#" className="forgot-password">Forgot Password?</a>
              </div>
            </Form>
            {error && <p className="error-message">{error}</p>}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
{/*import React, { useState } from 'react';
import { Container, Row, Col, Form, FormGroup, Button } from 'reactstrap';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { translateText } from '../../src/translate';
import '../styles/Home.css';

const Home = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [translatedText, setTranslatedText] = useState({});
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
      const response = await fetch('http://localhost:3006/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      const { token, id, profil } = data;

      localStorage.setItem('accessToken', token);
      localStorage.setItem('userId', id);
      localStorage.setItem('userProfil', profil);

      if (profil === 'fournisseur') {
        navigate(`/dashboard/${id}`);
      } else if (profil === 'bof' || profil === 'personnelfiscalite' || profil === 'agentTresorerie') {
        navigate(`/dashboardP/${id}`);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);

    const translateInterfaceText = async () => {
      const elementsToTranslate = {
        username: 'Enter your username',
        password: 'Enter your password',
        login: 'Login',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot Password?',
      };

      for (const [key, value] of Object.entries(elementsToTranslate)) {
        elementsToTranslate[key] = await translateText(value, selectedLanguage);
      }

      setTranslatedText(elementsToTranslate);
    };

    try {
      await translateInterfaceText();
    } catch (error) {
      console.error('Translation failed', error);
    }
  };

  return (
    <div className="full-page-background">
      <Container className="content-container">
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container">
              <div className="login__header">
                <div className="login__icon">
                  <FaUser />
                </div>
              </div>
              <Form onSubmit={handleLogin}>
                <FormGroup>
                  <label htmlFor="username"><FaUser /> {translatedText.username || 'Enter your username'}</label>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    required
                    id="username"
                    onChange={handleInputChange}
                    className="custom-input"
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="password"><FaLock /> {translatedText.password || 'Enter your password'}</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    required
                    id="password"
                    onChange={handleInputChange}
                    className="custom-input"
                  />
                </FormGroup>
                <Button
                  className="auth__btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : (translatedText.login || 'Login')}
                </Button>
              </Form>
              {error && <p className="error-message">{error}</p>}
            </div>
            <div className="login__options">
              <div>
                <input type="checkbox" id="rememberMe" />
                <label htmlFor="rememberMe">{translatedText.rememberMe || 'Remember me'}</label>
              </div>
              <a href="/forgot-password" className="forgot-password">{translatedText.forgotPassword || 'Forgot Password?'}</a>
            </div>
            <div>
              <label htmlFor="language">Select Language: </label>
              <select id="language" value={language} onChange={handleLanguageChange}>
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
                <option value="de">German</option>
               
              </select>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
*/}