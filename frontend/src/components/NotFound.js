import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div
    style={{
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: 'rgba(20,20,20,0.98)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 9999
    }}
  >
    <Card
      className="p-5 shadow-lg border-0"
      style={{
        maxWidth: 420,
        background: 'rgba(30,30,30,0.97)',
        borderRadius: '2rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        textAlign: 'center'
      }}
    >
      <h2
        className="fw-bold"
        style={{
          fontSize: '2.3rem',
          letterSpacing: '1.5px',
          color: '#ff3b3b', // Red for error
          textShadow: '1px 2px 8px rgba(0,0,0,0.7)'
        }}
      >
        404 - Page Not Found
      </h2>
      <p className="mt-3 mb-4" style={{ color: '#ff3b3b', fontSize: '1.15rem', opacity: 0.93 }}>
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Button
          variant="warning"
          style={{
            borderRadius: '1.2rem',
            fontWeight: 600,
            fontSize: '1.08rem',
            color: '#212529',
            padding: '0.6rem 2.2rem',
            boxShadow: '0 4px 16px rgba(255,193,7,0.13)',
            border: 'none',
            letterSpacing: '0.5px'
          }}
        >
          Go to Home
        </Button>
      </Link>
    </Card>
  </div>
);

export default NotFound;