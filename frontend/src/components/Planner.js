import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const Planner = () => {
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get('/api/recipes').then(res => setRecipes(res.data));
  }, []);

  const handleSelect = (day, recipeId) => {
    setSelected({ ...selected, [day]: recipeId });
  };

  const handleSave = () => {
    localStorage.setItem('planner', JSON.stringify(selected));
    setSuccess('Meal plan saved!');
    setTimeout(() => setSuccess(''), 1500);
  };

  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

  return (
    <Container className="py-4" style={{
      background: 'rgba(255,255,255,0.96)',
      borderRadius: '2.5rem',
      minHeight: '80vh',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)'
    }}>
      <h2 className="mb-4 text-center fw-bold text-gradient" style={{ fontSize: '2.7rem', letterSpacing: '1px' }}>Weekly Meal Planner</h2>
      {success && <Alert variant="success">{success}</Alert>}
      <Row>
        {days.map(day => (
          <Col md={6} lg={4} key={day} className="mb-3">
            <Card className="shadow-lg border-0 rounded-4" style={{
              background: 'rgba(255,255,255,0.99)',
              borderRadius: '2rem',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.13)'
            }}>
              <Card.Body>
                <Card.Title className="fw-bold" style={{ fontSize: '1.18rem', color: '#334155' }}>{day}</Card.Title>
                <Form.Select value={selected[day] || ''} onChange={e => handleSelect(day, e.target.value)} className="btn-glass mt-2">
                  <option value="">Select Recipe</option>
                  {recipes.map(r => <option key={r._id} value={r._id}>{r.title}</option>)}
                </Form.Select>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="text-center mt-4">
        <Button variant="primary" onClick={handleSave} className="btn-glass px-5 py-2 fw-bold" style={{ fontSize: '1.13rem' }}>Save Plan</Button>
      </div>
    </Container>
  );
};

export default Planner;
