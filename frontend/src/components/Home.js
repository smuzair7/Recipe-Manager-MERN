import React from 'react';
import { Button, Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="hero-bg d-flex align-items-center justify-content-center" style={{ minHeight: '90vh', position: 'relative' }}>
    <Container className="text-center">
      <Card className="mx-auto p-5 shadow-lg border-0" style={{
        maxWidth: 600,
        background: 'rgba(255,255,255,0.85)',
        borderRadius: '2.5rem',
        boxShadow: '0 8px 40px 0 rgba(31, 38, 135, 0.13)',
        backdropFilter: 'blur(8px)',
        border: '1.5px solid #e0e7ef'
      }}>
        <h1 className="mb-4 fw-bold display-2 text-gradient" style={{
          letterSpacing: '2px',
          textShadow: '2px 2px 16px #00000011',
          fontFamily: "'Inter', 'Segoe UI', 'Roboto', Arial, sans-serif"
        }}>
          Today Recipe
        </h1>
        <p className="lead mb-4 text-secondary" style={{
          fontSize: '1.5rem',
          maxWidth: 520,
          margin: '0 auto',
          textShadow: '1px 1px 8px #00000011',
          fontWeight: 500
        }}>
          Discover, share, and plan your favorite recipes for every occasion.<br />
          <span style={{ color: '#3b82f6', fontWeight: 600 }}>Make meal planning easy and fun for your family!</span>
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button as={Link} to="/browse" variant="outline-primary" className="px-4 py-2 fw-bold shadow-sm btn-glass" style={{ fontSize: '1.15rem' }}>
            Browse Recipes
          </Button>
          <Button as={Link} to="/add" variant="primary" className="px-4 py-2 fw-bold shadow-sm btn-glass" style={{ fontSize: '1.15rem' }}>
            Add Recipe
          </Button>
        </div>
      </Card>
    </Container>
  </div>
);

export default Home;
