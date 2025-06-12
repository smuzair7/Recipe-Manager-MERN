import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const Planner = () => {
  const [favorites, setFavorites] = useState([]);
  const [selected, setSelected] = useState({});
  const [message, setMessage] = useState('');
  const [oldPlans, setOldPlans] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [planName, setPlanName] = useState('');
  const [creatingPlan, setCreatingPlan] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/users/favorites', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setFavorites(res.data.favorites));
    axios.get('/api/mealplans/week', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setOldPlans(res.data));
  }, []);

  const handleSavePlan = async () => {
  const token = localStorage.getItem('token');

  if (!planName || Object.keys(selected).length < 7) {
    setMessage('Please provide a plan name and select recipes for all days.');
    setTimeout(() => setMessage(''), 3000);
    return;
  }

  try {
    for (const [date, recipeId] of Object.entries(selected)) {
      await axios.post(
        '/api/mealplans/add',
        { date, recipeId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    }

    setOldPlans([...oldPlans, { name: planName, days: selected }]);
    setCreatingPlan(false);
    setSelected({});
    setPlanName('');
    setMessage('Plan saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  } catch (err) {
    console.error(err);
    setMessage('Error saving plan.');
    setTimeout(() => setMessage(''), 3000);
  }
};


  const generateShoppingList = (plan) => {
    const selectedRecipes = favorites.filter(r => Object.values(plan.days).includes(r._id));
    const ingredients = selectedRecipes.flatMap(r => r.ingredients);
    const uniqueIngredients = Array.from(new Set(ingredients.map(i => i.name))).map(name => ({
      name,
      quantity: ingredients.find(i => i.name === name)?.quantity || '',
    }));
    setShoppingList(uniqueIngredients);
  };

  const week = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  return (
    <Container
      className="py-4"
      style={{
        background: 'rgba(30,30,30,0.93)', // Dark theme matching Home page
        borderRadius: '2.5rem',
        minHeight: '80vh',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        color: '#fff',
        marginTop: '100px',
        marginBottom: '10px',
      }}
    >
      <h2
        className="mb-4 text-center fw-bold"
        style={{
          fontSize: '2.5rem',
          letterSpacing: '1px',
          color: '#ffc107',
        }}
      >
        Weekly Meal Planner
      </h2>

      {message && <Alert variant="success">{message}</Alert>}

      {/* Old Plans Section */}
      <h4 className="fw-bold mb-3" style={{ color: '#ffc107' }}>
        Old Plans
      </h4>
      {oldPlans.length === 0 ? (
        <p style={{ color: '#ddd' }}>No old plans available.</p>
      ) : (
        <ListGroup className="mb-4">
          {oldPlans.map((plan, i) => (
            <ListGroup.Item
              key={i}
              className="d-flex justify-content-between align-items-center"
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#212529',
              }}
            >
              <span>{plan.name}</span>
              <div>
                <i
                  className="bi bi-eye text-info fs-5 me-3"
                  style={{ cursor: 'pointer' }}
                  title="View Plan"
                  onClick={() => setCurrentPlan(plan)}
                ></i>
                <i
                  className="bi bi-cart text-warning fs-5"
                  style={{ cursor: 'pointer' }}
                  title="Show Shopping List"
                  onClick={() => generateShoppingList(plan)}
                ></i>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Create New Plan Section */}
      {!creatingPlan ? (
        <Button
          variant="warning"
          className="fw-bold mb-4"
          style={{
            backgroundColor: '#ffc107',
            border: 'none',
            color: '#212529',
          }}
          onClick={() => setCreatingPlan(true)}
        >
          + Create New Plan
        </Button>
      ) : (
        <>
          <Form.Group className="mb-4">
            <Form.Label style={{ color: '#ffc107' }}>Plan Name</Form.Label>
            <Form.Control
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#212529',
              }}
            />
          </Form.Group>
          <Row>
            {week.map((date, i) => (
              <Col md={6} lg={4} key={i} className="mb-4">
                <Card
                  className="shadow-lg border-0 rounded-4"
                  style={{
                    background: 'rgba(40,40,40,0.97)',
                    borderRadius: '2rem',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
                    color: '#fff',
                  }}
                >
                  <Card.Body>
                    <Card.Title
                      className="fw-bold"
                      style={{
                        fontSize: '1.2rem',
                        color: '#ffc107',
                      }}
                    >
                      {date}
                    </Card.Title>
                    <Form.Select
                      value={selected[date] || ''}
                      onChange={(e) =>
                        setSelected((prev) => ({ ...prev, [date]: e.target.value }))
                      }
                      className="mt-2"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        color: '#212529',
                      }}
                    >
                      <option value="" hidden>Select Recipe</option>
                      {favorites.map((f) => (
                        <option key={f._id} value={f._id}>
                          {f.title}
                        </option>
                      ))}
                    </Form.Select>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <Button
            variant="warning"
            className="fw-bold mt-3"
            style={{
              backgroundColor: '#ffc107',
              border: 'none',
              color: '#212529',
            }}
            onClick={handleSavePlan}
          >
            Save Plan
          </Button>
        </>
      )}

      {/* Shopping List Section */}
      {shoppingList.length > 0 && (
        <div className="mt-5">
          <h4
            className="fw-bold mb-3"
            style={{
              color: '#ffc107',
            }}
          >
            Shopping List
          </h4>
          <ListGroup>
            {shoppingList.map((item, i) => (
              <ListGroup.Item
                key={i}
                className="d-flex justify-content-between align-items-center"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                }}
              >
                {item.name}
                {item.quantity && <span>{item.quantity}</span>}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}

      {/* View Plan Section */}
      {currentPlan && (
        <div className="mt-5">
          <h4
            className="fw-bold mb-3"
            style={{
              color: '#ffc107',
            }}
          >
            {currentPlan.name}
          </h4>
          <ListGroup>
            {Object.entries(currentPlan.days).map(([day, recipeId], i) => (
              <ListGroup.Item
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                }}
              >
                {day}: {favorites.find((f) => f._id === recipeId)?.title || 'No Recipe Selected'}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
    </Container>
  );
};

export default Planner;