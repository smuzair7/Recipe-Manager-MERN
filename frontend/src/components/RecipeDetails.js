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
    <Container className="py-4" style={{
      background: 'rgba(255,255,255,0.96)',
      borderRadius: '2.5rem',
      minHeight: '80vh',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)'
    }}>
      <Row>
        <Col md={6}>
          {recipe.image && <Card.Img src={`/uploads/${recipe.image}`} className="mb-3 rounded-4 shadow" style={{
            maxHeight: 350,
            objectFit: 'cover',
            border: '4px solid #fff',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.13)'
          }} />}
          {recipe.video && <video controls src={`/uploads/${recipe.video}`} className="w-100 mb-3 rounded-4 shadow" style={{
            maxHeight: 350,
            border: '4px solid #fff',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.13)'
          }} />}
        </Col>
        <Col md={6}>
          <h2 className="fw-bold mb-2" style={{ color: '#333', fontSize: '2.2rem', letterSpacing: '1px' }}>{recipe.title}</h2>
          <div className="mb-2">
            <Badge bg="info" className="me-1">{recipe.category}</Badge>
            {recipe.event && <Badge bg="warning" text="dark">{recipe.event}</Badge>}
          </div>
          <div className="mb-2">
            <span className="text-warning" style={{ fontSize: '1.2rem' }}>{'★'.repeat(Math.round(recipe.rating || 0))}{'☆'.repeat(5 - Math.round(recipe.rating || 0))}</span>
            <span className="ms-2" style={{ color: '#64748b' }}>({recipe.reviews.length} reviews)</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '1.08rem' }}>{recipe.description}</p>
          <ListGroup className="mb-2">
            <ListGroup.Item><b>Prep Time:</b> {recipe.prepTime} min</ListGroup.Item>
            <ListGroup.Item><b>Serving Size:</b> {recipe.servingSize}</ListGroup.Item>
            <ListGroup.Item><b>Difficulty:</b> {recipe.difficulty}</ListGroup.Item>
            {recipe.nutritionalInfo && <ListGroup.Item><b>Nutritional Info:</b> {recipe.nutritionalInfo}</ListGroup.Item>}
          </ListGroup>
          <Button variant="outline-primary" className="me-2 fw-bold btn-glass" onClick={() => setShowReview(true)}>Add Review</Button>
          <Button variant={isFavorite ? "danger" : "outline-danger"} className="me-2 fw-bold btn-glass" onClick={handleFavorite}>
            {isFavorite ? "Unfavorite" : "Favorite"}
          </Button>
          {/* Social sharing buttons */}
          <Button variant="outline-secondary" className="me-2 fw-bold btn-glass" href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`} target="_blank">WhatsApp</Button>
          <Button variant="outline-secondary" className="me-2 fw-bold btn-glass" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`} target="_blank">Twitter</Button>
          <Button variant="outline-secondary" className="fw-bold btn-glass" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank">Facebook</Button>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={6}>
          <h4 className="fw-bold" style={{ color: '#334155' }}>Ingredients</h4>
          <ListGroup>
            {recipe.ingredients.map((ing, i) =>
              <ListGroup.Item key={i}>
                {ing.name}{ing.quantity ? ` – ${ing.quantity}` : ''}
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>
        <Col md={6}>
          <h4 className="fw-bold" style={{ color: '#334155' }}>Preparation Steps</h4>
          <ol style={{ color: '#64748b', fontSize: '1.05rem' }}>
            {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <h4 className="fw-bold" style={{ color: '#334155' }}>Reviews</h4>
          {recipe.reviews.length === 0 && <p>No reviews yet.</p>}
          {recipe.reviews.map((r, i) => (
            <Card key={i} className="mb-2" style={{
              borderRadius: '1.2rem',
              background: 'rgba(245,248,255,0.97)',
              boxShadow: '0 2px 12px 0 rgba(31, 38, 135, 0.07)'
            }}>
              <Card.Body>
                <span className="text-warning" style={{ fontSize: '1.1rem' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <p className="mb-0" style={{ color: '#64748b' }}>{r.comment}</p>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
      <Modal show={showReview} onHide={() => setShowReview(false)} centered>
        <Modal.Header closeButton style={{ borderRadius: '1.5rem 1.5rem 0 0', background: '#f1f5f9' }}>
          <Modal.Title>Add Review</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ borderRadius: '0 0 1.5rem 1.5rem', background: '#f8fafc' }}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleReview}>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Select value={review.rating} onChange={e => setReview({ ...review, rating: e.target.value })} className="btn-glass">
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control as="textarea" value={review.comment} onChange={e => setReview({ ...review, comment: e.target.value })} className="btn-glass" />
            </Form.Group>
            <Button type="submit" variant="success" className="btn-glass px-4 fw-bold">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default RecipeDetails;
