import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return setError('Not logged in');
    axios.get('/api/users/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setUser(res.data);
        if (res.data.favorites?.length) {
          axios.get('/api/recipes', { params: { ids: res.data.favorites.join(',') } })
            .then(r => setFavoriteRecipes(r.data));
        }
      })
      .catch(() => setError('Failed to load profile'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (error) return (
    <div className="py-5 text-center">
      <Alert variant="danger">{error}</Alert>
    </div>
  );
  if (!user) return (
    <div className="py-5 text-center" style={{ color: '#ffc107' }}>
      Loading...
    </div>
  );

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
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
        <Row className="w-100 justify-content-center g-4">
          <Col md={6} lg={5}>
            <Card
              className="shadow-lg border-0 rounded-4 mb-4"
              style={{
                background: 'rgba(255, 193, 7, 0.95)',
                borderRadius: '2.2rem',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
                color: '#212529',
                maxWidth: 420,
                margin: '0 auto'
              }}
            >
              <Card.Body>
                <h2 className="mb-4 text-center fw-bold"
                  style={{
                    fontSize: '2rem',
                    letterSpacing: '1px',
                    color: '#212529'
                  }}>
                  My Profile
                </h2>
                <div className="mb-3" style={{ fontSize: '1.13rem', color: '#212529' }}>
                  <div>
                    <b>Name:</b> <span>{user.name}</span>
                  </div>
                  <div>
                    <b>Email:</b> <span>{user.email}</span>
                  </div>
                </div>
                <Button
                  variant="warning"
                  className="fw-bold"
                  style={{
                    borderRadius: '1.2rem',
                    color: '#212529',
                    fontWeight: 600,
                    fontSize: '1.08rem',
                    boxShadow: '0 4px 16px rgba(33,37,41,0.13)',
                    border: 'none',
                    letterSpacing: '0.5px',
                    width: '100%',
                    marginBottom: '1.2rem'
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Card.Body>
            </Card>
            <Card
              className="shadow-lg border-0 rounded-4"
              style={{
                background: 'rgba(255,255,255,0.97)',
                borderRadius: '2.2rem',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
                color: '#212529',
                maxWidth: 420,
                margin: '0 auto'
              }}
            >
              <Card.Body>
                <h5 className="fw-bold mt-2 mb-3 text-center" style={{ color: '#212529' }}>Favorite Recipes</h5>
                {favoriteRecipes.length === 0 && <div style={{ color: '#212529', textAlign: 'center' }}>No favorites yet.</div>}
                <ul style={{ paddingLeft: '1.2rem', marginBottom: 0 }}>
                  {favoriteRecipes.map(r =>
                    <li key={r._id} style={{ color: '#212529', marginBottom: '0.3rem' }}>
                      <Link to={`/recipe/${r._id}`} style={{ color: '#212529', textDecoration: 'underline' }}>{r.title}</Link>
                    </li>
                  )}
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Profile;