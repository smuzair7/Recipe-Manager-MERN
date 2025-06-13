import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const { data } = await axios.post('/api/users/login', { email, password });

      // Store token and user
      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }


      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {navigate('/profile'); window.location.reload();}, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };


  return (
    <div
      style={{
        minHeight: '100vh',
        background: "url('/background.jpg') center/cover no-repeat",
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.65)',
          zIndex: 1
        }}
      />
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
        <Row className="w-100 justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg border-0 rounded-4"
              style={{
                background: 'rgba(20,20,20,0.98)',
                borderRadius: '2.2rem',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
                color: '#212529'
              }}>
              <Card.Body>
                <h2 className="mb-4 text-center fw-bold"
                  style={{
                    fontSize: '2rem',
                    letterSpacing: '1px',
                    color: '#212529 ',
                  }}>
                  Login
                </h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: 320 }}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label style={{ color: '#212529' }}>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        color: '#212529',
                        width: '100%',
                        margin: '0 auto',
                        display: 'block'
                      }}
                      className="mx-auto"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label style={{ color: '#212529' }}>Password</Form.Label>
                    <div style={{ position: 'relative' }}>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          color: '#212529',
                          width: '100%',
                          margin: '0 auto',
                          display: 'block',
                          paddingRight: '2.5rem'
                        }}
                        className="mx-auto"
                      />
                      <span
                        onClick={() => setShowPassword(v => !v)}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          right: '12px',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                          color: '#ffc107',
                          fontSize: '1.2rem',
                          userSelect: 'none'
                        }}
                        title={showPassword ? "Hide Password" : "Show Password"}
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ffc107" viewBox="0 0 16 16">
                            <path d="M13.359 11.238l1.397 1.397a.75.75 0 1 1-1.06 1.06l-1.397-1.397A7.027 7.027 0 0 1 8 14c-4.418 0-8-4-8-6s3.582-6 8-6c1.61 0 3.11.47 4.359 1.238l1.397-1.397a.75.75 0 1 1 1.06 1.06l-1.397 1.397A7.027 7.027 0 0 1 16 8c0 2-3.582 6-8 6a7.027 7.027 0 0 1-4.359-1.238zM8 12c3.314 0 6-2.686 6-4s-2.686-4-6-4-6 2.686-6 4 2.686 4 6 4zm0-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ffc107" viewBox="0 0 16 16">
                            <path d="M13.359 11.238l1.397 1.397a.75.75 0 1 1-1.06 1.06l-1.397-1.397A7.027 7.027 0 0 1 8 14c-4.418 0-8-4-8-6s3.582-6 8-6c1.61 0 3.11.47 4.359 1.238l1.397-1.397a.75.75 0 1 1 1.06 1.06l-1.397 1.397A7.027 7.027 0 0 1 16 8c0 2-3.582 6-8 6a7.027 7.027 0 0 1-4.359-1.238zM8 12c3.314 0 6-2.686 6-4s-2.686-4-6-4-6 2.686-6 4 2.686 4 6 4zm0-6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
                            <line x1="2" y1="14" x2="14" y2="2" stroke="#ffc107" strokeWidth="2"/>
                          </svg>
                        )}
                      </span>
                    </div>
                  </Form.Group>
                  <Button
                    variant="warning"
                    type="submit"
                    className="w-100 fw-bold mt-2"
                    style={{
                      fontSize: '1rem',
                      borderRadius: '1.2rem',
                      color: '#212529',
                      boxShadow: '0 4px 16px rgba(255,193,7,0.18)',
                      border: 'none',
                      width: '100%',
                      margin: '0 auto',
                      display: 'block'
                    }}
                  >
                    Login
                  </Button>
                </Form>
                <div className="mt-3 text-center">
                  <span style={{ color: '#212529' }}>Don't have an account? </span>
                  <Link to="/register" style={{ color: '#ffc107', textDecoration: 'underline', fontWeight: 500 }}>Register</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <style>
        {`
          .form-control:focus {
            background: rgba(255,255,255,0.13);
            color: #212529;
          }
          .btn-warning:hover, .btn-warning:focus {
            background-color: #e0a800 !important;
            color: #212529 !important;
          }
        `}
      </style>
    </div>
  );
};

export default Login;