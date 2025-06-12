import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Container, Row, Col, ListGroup, Badge, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const fetchRecipe = async () => {
    const { data } = await axios.get(`/api/recipes/${id}`);
    setRecipe(data);
    // Check favorite
    const token = localStorage.getItem('token');
    if (token) {
      const userRes = await axios.get('/api/users/profile', { headers: { Authorization: `Bearer ${token}` } });
      setIsFavorite(userRes.data.favorites?.includes(id));
    }
  };
  useEffect(() => { fetchRecipe(); }, [id]);

  const handleReview = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/recipes/${id}/review`, review, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Review added!');
      setShowReview(false);
      fetchRecipe();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add review');
    }
  };

  const handleFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) return setError('Login to favorite recipes');
    await axios.post(`/api/recipes/${id}/favorite`, {}, { headers: { Authorization: `Bearer ${token}` } });
    setIsFavorite(fav => !fav);
  };

  if (!recipe) return <Container className="py-5 text-center">Loading...</Container>;

  return (
    <Container
      className="py-4"
      style={{
        background: 'rgba(30,30,30,0.93)', // Dark theme matching Home page
        borderRadius: '2.5rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        color: '#fff',
        marginTop: '100px',
        marginBottom: '10px',
        padding: '20px',
        maxWidth: '800px',
      }}
    >
      {/* Image Section */}
      {recipe.image && (
        <Card.Img
          src={`http://localhost:5000/uploads/${recipe.image}`}
          className="mb-4 rounded-4 shadow"
          style={{
            maxHeight: 400,
            objectFit: 'cover',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
          }}
        />
      )}

      {/* Title, Tags, Description, and Rating */}
      <Row className="mb-2">
        <Col md={8}>
          <h2
            className="fw-bold mb-3"
            style={{
              color: '#ffc107',
              fontSize: '2.5rem',
              letterSpacing: '1px',
            }}
          >
            {recipe.title}
          </h2>
          <div className="mb-3">
            <Badge bg="info" className="me-2">
              {recipe.category}
            </Badge>
            {recipe.event && (
              <Badge bg="warning" text="dark">
                {recipe.event}
              </Badge>
            )}
          </div>
          <p style={{ color: '#ddd', fontSize: '1.2rem' }}>
            {recipe.description}
          </p>
        </Col>
        <Col md={4} className="text-center">
          <span
            className="text-warning"
            style={{ fontSize: '2rem' }}
          >
            {'★'.repeat(Math.round(recipe.rating || 0))}
            {'☆'.repeat(5 - Math.round(recipe.rating || 0))}
          </span>
          <p style={{ color: '#bbb', fontSize: '1rem' }}>
            ({recipe.reviews.length} reviews)
          </p>
          </Col>
      </Row>
      <Row className="mb-5">
          <div >
            <i
              className="bi bi-pencil-square text-warning fs-4 me-3"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowReview(true)}
              title="Add Review"
            ></i>
            <i
              className={`bi ${isFavorite ? 'bi-heart-fill text-danger' : 'bi-heart text-danger'} fs-4 me-3 `}
              style={{ cursor: 'pointer' }}
              onClick={handleFavorite}
              title={isFavorite ? 'Unfavorite' : 'Favorite'}
            ></i>
            <div className="dropdown d-inline">
              <i
                className="bi bi-share text-secondary fs-4"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowShareOptions(!showShareOptions)}
                title="Share"
              ></i>
              {showShareOptions && (
                <div
                  className="dropdown-menu show"
                  style={{
                    position: 'absolute',
                    background: 'rgba(40,40,40,0.97)',
                    borderRadius: '0.5rem',
                    padding: '0.5rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    display: 'flex', // Ensures icons are aligned properly
                    gap: '0.2rem',
                    width: '150px', // Reduces the width of the dropdown
                    justifyContent: 'space-around',
                  }}
                >
                  <i
                    className="bi bi-whatsapp text-success fs-5 me-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      window.open(
                        `https://wa.me/?text=${encodeURIComponent(window.location.href)}`,
                        '_blank'
                      )
                    }
                    title="Share on WhatsApp"
                  ></i>
                  <i
                    className="bi bi-facebook text-primary fs-5 me-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                        '_blank'
                      )
                    }
                    title="Share on Facebook"
                  ></i>
                  <i
                    className="bi bi-twitter text-info fs-5"
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`,
                        '_blank'
                      )
                    }
                    title="Share on Twitter"
                  ></i>
                </div>
              )}
            </div>
          </div>
        </Row>

      {/* Ingredients Section */}
      <Row className="mb-4">
        <Col>
          <h4 className="fw-bold mb-3" style={{ color: '#ffc107' }}>
            Ingredients
          </h4>
          <ListGroup>
            {recipe.ingredients.map((ing, i) => (
              <ListGroup.Item
                key={i}
                className="d-flex align-items-center"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: ing.checked ? '#aaa' : '#212529', // Change color if checked
                  textDecoration: ing.checked ? 'line-through' : 'none', // Strike-through if checked
                }}
              >
                <Form.Check
                  type="checkbox"
                  className="me-2"
                  checked={ing.checked || false}
                  onChange={() => {
                    const updatedIngredients = [...recipe.ingredients];
                    updatedIngredients[i].checked = !updatedIngredients[i].checked;
                    setRecipe({ ...recipe, ingredients: updatedIngredients });
                  }}
                />
                {ing.name}
                {ing.quantity ? ` – ${ing.quantity}` : ''}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>

      {/* Preparation Steps Section */}
      <Row className="mb-4">
        <Col>
          <h4 className="fw-bold mb-3" style={{ color: '#ffc107' }}>
            Preparation Steps
          </h4>
          <ol style={{ color: '#ddd', fontSize: '1.2rem', listStyleType: 'none', paddingLeft: '0' }}>
            {recipe.steps.map((step, i) => (
              <li key={i} className="mb-2">
                <span style={{ color: '#ffc107', fontWeight: 'bold' }}>→</span> {step}
              </li>
            ))}
          </ol>
        </Col>
      </Row>

      {/* Reviews Section */}
      <Row>
        <Col>
          <h4 className="fw-bold mb-3" style={{ color: '#ffc107' }}>
            Reviews
          </h4>
          {recipe.reviews.length === 0 && (
            <p style={{ color: '#ddd' }}>No reviews yet.</p>
          )}
          {recipe.reviews.map((r, i) => (
            <Card
              key={i}
              className="mb-2"
              style={{
                borderRadius: '1.2rem',
                background: 'rgba(40,40,40,0.97)',
                boxShadow: '0 2px 12px 0 rgba(31, 38, 135, 0.2)',
                color: '#fff',
              }}
            >
              <Card.Body>
                <span
                  className="text-warning"
                  style={{ fontSize: '1.2rem' }}
                >
                  {'★'.repeat(r.rating)}
                  {'☆'.repeat(5 - r.rating)}
                </span>
                <p className="mb-0" style={{ color: '#212529' }}>
                  {r.comment}
                </p>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>

      {/* Add Review Modal */}
      <Modal show={showReview} onHide={() => setShowReview(false)} centered>
        <Modal.Header
          closeButton
          style={{
            borderRadius: '1.5rem 1.5rem 0 0',
            background: 'rgba(40,40,40,0.97)',
            color: '#fff',
          }}
        >
          <Modal.Title>Add Review</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            borderRadius: '0 0 1.5rem 1.5rem',
            background: 'rgba(30,30,30,0.93)',
            color: '#fff',
          }}
        >
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleReview}>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Select
                value={review.rating}
                onChange={(e) =>
                  setReview({ ...review, rating: e.target.value })
                }
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#212529',
                }}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                value={review.comment}
                onChange={(e) =>
                  setReview({ ...review, comment: e.target.value })
                }
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#212529',
                }}
              />
            </Form.Group>
            <Button
              type="submit"
              variant="warning"
              className="px-4 fw-bold"
              style={{
                backgroundColor: '#ffc107',
                border: 'none',
                color: '#212529',
              }}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default RecipeDetails;
