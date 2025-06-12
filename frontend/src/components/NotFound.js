import React from 'react';
import { Container, Card } from 'react-bootstrap';

const NotFound = () => (
  <Container className="py-5 d-flex align-items-center justify-content-center" style={{
    background: 'rgba(255,255,255,0.96)',
    borderRadius: '2.5rem',
    minHeight: '80vh',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)'
  }}>
    <Card className="mx-auto p-5 shadow-lg border-0" style={{
      maxWidth: 480,
      background: 'rgba(255,255,255,0.92)',
      borderRadius: '2rem',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.13)',
      textAlign: 'center'
    }}>
      <h2 className="fw-bold text-gradient" style={{ fontSize: '2.2rem', letterSpacing: '1px' }}>404 - Page Not Found</h2>
      <p className="mt-3" style={{ color: '#64748b', fontSize: '1.13rem' }}>The page you are looking for does not exist.</p>
    </Card>
  </Container>
);

export default NotFound;
