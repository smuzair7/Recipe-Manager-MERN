import React, { useEffect, useState } from 'react';
import { Card, Button, Container, ListGroup, Alert } from 'react-bootstrap';
import axios from 'axios';

const ShoppingList = () => {
  const [list, setList] = useState([]);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Get planner from localStorage
    const planner = JSON.parse(localStorage.getItem('planner') || '{}');
    const recipeIds = Object.values(planner).filter(Boolean);
    if (recipeIds.length === 0) return;
    axios.get('/api/recipes', { params: { ids: recipeIds.join(',') } })
      .then(res => {
        // Flatten ingredients and sum quantities by name
        const map = {};
        res.data.forEach(r => {
          r.ingredients.forEach(ing => {
            if (!map[ing.name]) map[ing.name] = { ...ing };
            else if (ing.quantity) {
              // Try to sum numeric quantities if possible
              const prev = parseFloat(map[ing.name].quantity);
              const curr = parseFloat(ing.quantity);
              if (!isNaN(prev) && !isNaN(curr)) map[ing.name].quantity = (prev + curr).toString();
              else map[ing.name].quantity += `, ${ing.quantity}`;
            }
          });
        });
        setList(Object.values(map));
      });
  }, []);

  const handleRemove = (item) => {
    setList(list.filter(i => i.name !== item.name));
    setSuccess('Item removed!');
    setTimeout(() => setSuccess(''), 1000);
  };

  return (
    <Container className="py-4" style={{
      background: 'rgba(255,255,255,0.96)',
      borderRadius: '2.5rem',
      minHeight: '80vh',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)'
    }}>
      <h2 className="mb-4 text-center fw-bold text-gradient" style={{ fontSize: '2.7rem', letterSpacing: '1px' }}>Shopping List</h2>
      {success && <Alert variant="success">{success}</Alert>}
      <Card className="shadow-lg border-0 rounded-4" style={{
        background: 'rgba(255,255,255,0.99)',
        borderRadius: '2rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.13)'
      }}>
        <Card.Body>
          <ListGroup>
            {list.length === 0 && <ListGroup.Item>No items in your shopping list.</ListGroup.Item>}
            {list.map((item, i) => (
              <ListGroup.Item key={i} className="d-flex justify-content-between align-items-center">
                <span style={{ fontWeight: 500 }}>{item.name}{item.quantity ? ` – ${item.quantity}` : ''}</span>
                <Button variant="outline-danger" size="sm" className="btn-glass" onClick={() => handleRemove(item)}>Remove</Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ShoppingList;
