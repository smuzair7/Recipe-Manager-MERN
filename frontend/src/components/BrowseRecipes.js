import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Container, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BrowseRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: '', subcategory: '', event: '', difficulty: '', rating: '', time: '', ingredient: '' });
  const [sort, setSort] = useState('');
  const [categories, setCategories] = useState({});

  const fetchRecipes = async () => {
    const params = { keyword: search, ...filters };
    const { data } = await axios.get('/api/recipes', { params });
    let sorted = data;
    if (sort === 'rating-desc') {
      sorted = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'rating-asc') {
      sorted = [...data].sort((a, b) => (a.rating || 0) - (b.rating || 0));
    }
    setRecipes(sorted);
  };

  useEffect(() => {
    axios.get('/api/recipes/categories').then(res => setCategories(res.data));
    fetchRecipes();
  }, []); // initial load

  const handleSearch = e => {
    e.preventDefault();
    fetchRecipes();
  };

  const handleFilter = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  useEffect(() => { fetchRecipes(); }, [filters, sort]);

  return (
    <Container className="py-4" style={{ background: 'rgba(255,255,255,0.96)', borderRadius: '2.5rem', minHeight: '80vh', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}>
      <h2 className="mb-4 text-center fw-bold text-gradient" style={{ fontSize: '2.7rem', letterSpacing: '1px' }}>Browse Recipes</h2>
      <Form onSubmit={handleSearch} className="mb-3">
        <InputGroup>
          <Form.Control placeholder="Search recipes..." value={search} onChange={e => setSearch(e.target.value)} style={{ borderRadius: '2rem 0 0 2rem', fontSize: '1.1rem' }} />
          <Button type="submit" variant="primary" className="btn-glass" style={{ borderRadius: '0 2rem 2rem 0' }}>Search</Button>
        </InputGroup>
        <Row className="mt-3 g-2">
          <Col md={2}>
            <Form.Select name="category" value={filters.category} onChange={handleFilter} className="btn-glass">
              <option value="">Category</option>
              {Object.keys(categories).map(cat => <option key={cat}>{cat}</option>)}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select name="subcategory" value={filters.subcategory || ''} onChange={handleFilter} className="btn-glass" disabled={!filters.category}>
              <option value="">Sub-category</option>
              {(categories[filters.category] || []).map(sub => <option key={sub}>{sub}</option>)}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select name="event" value={filters.event} onChange={handleFilter} className="btn-glass">
              <option value="">Event</option>
              <option>Eid</option>
              <option>Wedding</option>
              <option>Ramadan</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select name="difficulty" value={filters.difficulty} onChange={handleFilter} className="btn-glass">
              <option value="">Difficulty</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select name="rating" value={filters.rating} onChange={handleFilter} className="btn-glass">
              <option value="">Rating</option>
              <option value="4">4+</option>
              <option value="3">3+</option>
              <option value="2">2+</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Control
              name="time"
              value={filters.time}
              onChange={handleFilter}
              placeholder="Prep Time (max min)"
              className="btn-glass"
              type="number"
              min="1"
            />
          </Col>
          <Col md={2}>
            <Form.Control
              name="ingredient"
              value={filters.ingredient}
              onChange={handleFilter}
              placeholder="Ingredient"
              className="btn-glass"
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={3}>
            <Form.Select value={sort} onChange={e => setSort(e.target.value)} className="btn-glass">
              <option value="">Sort by</option>
              <option value="rating-desc">Rating: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>
      <Row>
        {recipes.length === 0 && <p className="text-center mt-4">No recipes found.</p>}
        {recipes.map(recipe => (
          <Col md={4} lg={3} className="mb-4" key={recipe._id}>
            <Card className="h-100 shadow-lg border-0 recipe-card-glass" style={{
              background: 'rgba(255,255,255,0.99)',
              borderRadius: '2rem',
              transition: 'box-shadow 0.22s, transform 0.18s'
            }}>
              {recipe.image && <Card.Img variant="top" src={`/uploads/${recipe.image}`} style={{
                height: 180,
                objectFit: 'cover',
                borderRadius: '2rem 2rem 0 0'
              }} />}
              <Card.Body>
                <Card.Title className="fw-bold" style={{ fontSize: '1.25rem', color: '#334155' }}>{recipe.title}</Card.Title>
                <Card.Text style={{ color: '#64748b', fontSize: '1.02rem' }}>{recipe.description.slice(0, 60)}...</Card.Text>
                <div className="mb-2">
                  <span className="badge bg-info me-1">{recipe.category}</span>
                  {recipe.event && <span className="badge bg-warning text-dark">{recipe.event}</span>}
                </div>
                <div className="mb-2">
                  <span className="text-warning" style={{ fontSize: '1.1rem' }}>{'★'.repeat(Math.round(recipe.rating || 0))}{'☆'.repeat(5 - Math.round(recipe.rating || 0))}</span>
                </div>
                <Button as={Link} to={`/recipe/${recipe._id}`} variant="outline-primary" size="sm" className="fw-bold btn-glass mt-2" style={{ fontSize: '1.01rem' }}>View Details</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BrowseRecipes;
