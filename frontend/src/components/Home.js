import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Sweets', color: '#fbbf24', url: '/sweets.jpg'},
  { name: 'Desi Food', color: '#60a5fa', url: '/desi-food.jpg'},
  { name: 'Fast Food', color: '#f472b6', url: '/fast-food.jpg'},
  { name: 'Drinks', color: '#86efac', url: '/drinks.jpg'},
];

const Home = () => {
  const isLoggedIn = !!localStorage.getItem('token'); // or use context/auth state

  return (
    <div className="bg-dark text-white">

      {/* Hero Section */}
      <div
        className="position-relative"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh', // ✅ Full screen height
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
          }}
        />
        <Container
          className="position-relative text-center text-white d-flex flex-column justify-content-center align-items-center"
          style={{
            height: '100vh',  // ✅ Ensures content vertically centers
            zIndex: 1,
          }}
        >
          <div className='position-absolute top-50 start-50 translate-middle text-center text-white d-flex flex-column justify-content-center align-items-center'>
            <h1 className="display-3 fw-bold mb-3" style={{ textShadow: '2px 2px 12px rgba(0,0,0,0.8)' }}>
              Even Better Than an Expensive Cookery Book
            </h1>
            <p className="lead mb-4 text-light">
              Learn how to make your favorite restaurant’s dishes from scratch.
            </p>
            <div className="d-flex gap-3 flex-wrap justify-content-center">
              <Button
                as={Link}
                to="/browse"
                size="lg"
                variant="warning"
                className="fw-semibold px-4 py-2 custom-btn-warning"
                style={{ textDecoration: 'none' }}
              >
                Browse Recipes
              </Button>
              {isLoggedIn ? (
                <Button
                  as={Link}
                  to="/add"
                  size="lg"
                  variant="outline-light"
                  className="px-4 py-2 custom-btn-outline"
                  style={{ textDecoration: 'none' }}
                >
                  Submit Recipe
                </Button>
              ) : (
                <Button
                  as={Link}
                  to="/login"
                  size="lg"
                  variant="outline-light"
                  className="px-4 py-2 custom-btn-outline"
                  style={{ textDecoration: 'none' }}
                >
                  Login
                </Button>
              )}
            </div>
            <style>
              {`
                .btn a, .btn:focus, .btn:hover, .btn:active {
                  text-decoration: none !important;
                }
                .custom-btn-warning {
                  background-color: #ffc107;
                  border-color: #ffc107;
                  color: #212529;
                  transition: background 0.2s, border 0.2s;
                }
                .custom-btn-warning:hover, .custom-btn-warning:focus {
                  background-color:rgb(152, 115, 4) !important;
                  border-color: #d39e00 !important;
                  color: #212529 !important;
                }
                .custom-btn-outline {
                  transition: background 0.2s, color 0.2s, border 0.2s;
                }
                .custom-btn-outline:hover, .custom-btn-outline:focus {
                  background-color: #fff !important;
                  color: #212529 !important;
                  border-color: #fff !important;
                }
              `}
            </style>

          </div>
        </Container>
      </div>

      {/* Recipes By Category */}
      <section className="bg-dark text-white" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', padding: '0' }}>
        <Container>
          <h2 className="text-center fw-bold mb-4">Recipes By Category</h2>
          <p className="text-center mb-5 ">
            Explore popular categories to satisfy your cravings.
          </p>
          <Row className="g-4 justify-content-center">
            {categories.map(({ name, url }) => (
              <Col key={name} xs={12} sm={6} md={3}>
                <Link
                  to={`/browse?category=${name.toLowerCase()}`}
                  className="text-decoration-none"
                  style={{ display: 'block', height: '100%' }}
                >
                  <Card
                    className="text-white border-0 shadow-lg position-relative category-card" // ⛔ removed h-100
                    style={{
                      height: '320px', 
                      borderRadius: '1.25rem',
                      overflow: 'hidden',
                      background: 'rgba(30,30,30,0.6)',
                      backdropFilter: 'blur(4px)',
                      transition: 'transform 0.3s cubic-bezier(.25,.8,.25,1), box-shadow 0.3s',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                      border: '1.5px solid rgba(255,255,255,0.08)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.04)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,193,7,0.18)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
                    }}
                  >
                    {/* Card Image */}
                    <div style={{
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: 0, left: 0,
                      zIndex: 1,
                      background: `url(${url}), url('/fallback.jpg')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter: 'brightness(0.85)',
                      transition: 'filter 0.3s',
                    }} />
                    {/* Overlay */}
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100"
                      style={{
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.7) 100%)',
                        zIndex: 2,
                      }}
                    />
                    <Card.Body
                      className="position-relative d-flex flex-column justify-content-end align-items-center text-center"
                      style={{ zIndex: 3, height: '100%' }}
                    >
                      <Card.Title className="fw-bold text-white fs-4 mb-3" style={{ textShadow: '1px 2px 8px rgba(0,0,0,0.7)' }}>
                        {name}
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>

        
        {/* Responsive and fallback image CSS */}
        <style>
          {`
            @media (max-width: 767px) {
              .category-card {
                height: 240px !important;
              }
              .category-card .card-title {
                font-size: 1.1rem !important;
              }
            }
          `}
        </style>
      </section>


      {/* About Section */}
      <section
      className="bg-dark text-white d-flex align-items-center"
      style={{
        height: '100vh', // Full screen height
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Dark background
      }}
      >
      <Container>
        <Row className="align-items-center">
          {/* Text Content */}
          <Col md={5}>
            <h2 className="fw-bold mb-4" style={{ textShadow: '2px 2px 12px rgba(0,0,0,0.8)' }}>
              About Today Recipe
            </h2>
            <p className="mb-4" style={{ fontSize: '1.2rem', color: '#ddd' }}>
              Today Recipe is your ultimate destination for discovering, sharing, and enjoying recipes from around the world. Whether you're a seasoned chef or a beginner, you'll find inspiration here.
            </p>
            <Button
              as={Link}
              to="/browse"
              variant="warning"
              size="lg"
              className="px-4 py-2 fw-semibold custom-btn-warning"
              style={{ textDecoration: 'none' }}
            >
              Explore Recipes
            </Button>
          </Col>

          {/* Image */}
          <Col md={7}>
            <img
              src="/about.jpg"
              alt="About Today Recipe"
              className="img-fluid rounded hover-move"
              style={{
                maxHeight: '500px',
                height: '75%',
                width: '100%',
                objectFit: 'cover',
                transition: 'transform 0.3s ease', // Smooth transition
              }}
            />
          </Col>

          <style>
            {`
              .hover-move:hover {
                transform: translateY(-10px); /* Moves the image slightly upward */
              }
            `}
          </style>
        </Row>
      </Container>
      </section>


      {/* Footer Section */}
      <footer
        className="w-100 mt-auto py-4"
        style={{
          background: 'rgba(20, 20, 20, 0.98)',
          borderTop: '1.5px solid rgba(255,255,255,0.08)',
          boxShadow: '0 -2px 24px rgba(0,0,0,0.18)',
          color: '#fff',
          letterSpacing: '0.5px',
        }}
      >
        <Container className="text-center">
          <div className="mb-2">
            <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#ffc107' }}>
              Today Recipe
            </span>
            <span className="mx-2" style={{ color: '#fff', opacity: 0.5 }}>|</span>
            <span style={{ fontSize: '1rem', color: '#bbb' }}>
              Made with <span style={{ color: '#ff7675' }}>♥</span> for food lovers
            </span>
          </div>
          <div style={{ fontSize: '0.95rem', color: '#aaa' }}>
            &copy; {new Date().getFullYear()} Today Recipe &mdash; All rights reserved.
          </div>
          <div className="mt-2">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#ffc107',
                textDecoration: 'none',
                margin: '0 0.5rem',
                fontWeight: 500,
              }}
            >
              GitHub
            </a>
            <span style={{ color: '#fff', opacity: 0.3 }}>|</span>
            <a
              href="mailto:info@todayrecipe.com"
              style={{
                color: '#ffc107',
                textDecoration: 'none',
                margin: '0 0.5rem',
                fontWeight: 500,
              }}
            >
              Contact
            </a>
          </div>
        </Container>
      </footer>
    </div>

  );
};

export default Home;