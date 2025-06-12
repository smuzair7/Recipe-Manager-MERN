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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const { data } = await axios.post('/api/users/register', { name, email, password });
      localStorage.setItem('token', data.token);
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/profile'), 1200); // Redirect to profile after registration
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{
      minHeight: '80vh',
      background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)'
    }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg border-0 rounded-4" style={{
            background: 'rgba(255,255,255,0.98)',
            borderRadius: '2.2rem',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.13)'
          }}>
            <Card.Body>
              <h2 className="mb-4 text-center text-success fw-bold" style={{ fontSize: '2rem', letterSpacing: '1px' }}>Register</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </Form.Group>
                <Button variant="success" type="submit" className="w-100 fw-bold btn-glass mt-2" style={{ fontSize: '1.13rem' }}>Register</Button>
              </Form>
              <div className="mt-3 text-center">
                <span>Already have an account? </span>
                <Link to="/login">Login</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
