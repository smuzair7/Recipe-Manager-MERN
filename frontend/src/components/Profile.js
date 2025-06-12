import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

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

  if (error) return <Container className="py-5 text-center"><Alert variant="danger">{error}</Alert></Container>;
  if (!user) return <Container className="py-5 text-center">Loading...</Container>;

  return (
    <Container className="py-4" style={{
      background: 'rgba(255,255,255,0.96)',
      borderRadius: '2.5rem',
      minHeight: '80vh',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)'
    }}>
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg border-0 rounded-4" style={{
            background: 'rgba(255,255,255,0.99)',
            borderRadius: '2rem',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.13)'
          }}>
            <Card.Body>
              <h2 className="mb-4 text-center" style={{ color: '#333', fontWeight: 'bold', fontSize: '2rem', letterSpacing: '1px' }}>Profile</h2>
              <p style={{ fontSize: '1.13rem', color: '#334155' }}><b>Name:</b> {user.name}</p>
              <p style={{ fontSize: '1.13rem', color: '#334155' }}><b>Email:</b> {user.email}</p>
              <Button variant="danger" className="btn-glass mt-2" onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}>Logout</Button>
              <hr />
              <h5 className="fw-bold mt-3 mb-2" style={{ color: '#334155' }}>Favorite Recipes</h5>
              {favoriteRecipes.length === 0 && <div>No favorites yet.</div>}
              <ul>
                {favoriteRecipes.map(r =>
                  <li key={r._id}>
                    <Link to={`/recipe/${r._id}`}>{r.title}</Link>
                  </li>
                )}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
