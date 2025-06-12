import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Password validation function
  const isPasswordStrong = (pwd) => {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!isPasswordStrong(password)) {
      setError('Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
      return;
    }
    try {
      const { data } = await axios.post('/api/users/register', { name, email, password });
      localStorage.setItem('token', data.token);
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
      <Container className="d-flex align-items-center justify-content-center" 
      style={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
        <Row className="w-100 justify-content-center">
          <Col md={6} lg={5}>
            <Card className="shadow-lg border-0 rounded-4"
              style={{
                background: 'rgba(30,30,30,0.92)',
                borderRadius: '2.2rem',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
                color: '#fff'
              }}>
              <Card.Body>
                <h2 className="mb-4 text-center fw-bold" 
                  style={{ fontSize: '2rem',
                          letterSpacing: '1px', 
                          color: '#212529'}}>
                    Register User
                </h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: 320 }}>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label style={{ color: '#212529' }}>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
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
                        width: '100%', // Match button width
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
                      width: '100%', // Full width of form
                      margin: '0 auto',
                      display: 'block'
                    }}
                  >
                    Register
                  </Button>
                </Form>
                <div className="mt-3 text-center">
                  <span style={{ color: '#212529' }}>Already have an account? </span>
                  <Link to="/login" style={{ color: '#ffc107', textDecoration: 'underline', fontWeight: 500 }}>Login</Link>
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
            color: #fff;
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

export default Register;