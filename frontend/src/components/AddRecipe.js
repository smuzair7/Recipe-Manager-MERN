import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddRecipe = () => {
  const [form, setForm] = useState({
    title: '', description: '', steps: '', category: '', event: '', prepTime: '', servingSize: '', difficulty: 'Easy', nutritionalInfo: ''
  });
  const [media, setMedia] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState({});
  const [customCategory, setCustomCategory] = useState('');
  const [customSubcategory, setCustomSubcategory] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/recipes/categories').then(res => setCategories(res.data));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = e => setMedia(e.target.files[0]);

  const handleIngredientChange = (idx, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[idx][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => setIngredients([...ingredients, { name: '', quantity: '' }]);
  const removeIngredient = idx => setIngredients(ingredients.filter((_, i) => i !== idx));

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (media) data.append('media', media);
    // Ingredients as JSON [{name, quantity}]
    data.set('ingredients', JSON.stringify(ingredients.filter(i => i.name)));
    data.set('steps', JSON.stringify(form.steps.split('\n')));
    // Category/subcategory
    data.set('category', customCategory || form.category);
    data.set('subcategory', customSubcategory || form.subcategory || '');
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/recipes', data, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      setSuccess('Recipe added!');
      setTimeout(() => navigate('/browse'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add recipe');
    }
  };

  return (
    <Container className="py-5" style={{ background: 'rgba(255,255,255,0.96)', borderRadius: '2.5rem', minHeight: '80vh', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}>
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <Card className="shadow-lg border-0 rounded-4" style={{
            background: 'rgba(255,255,255,0.99)',
            borderRadius: '2.5rem',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.13)'
          }}>
            <Card.Body>
              <h2 className="mb-4 text-center fw-bold text-success" style={{ fontSize: '2.2rem', letterSpacing: '1px' }}>Add New Recipe</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control name="title" value={form.title} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" name="description" value={form.description} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="ingredients">
                  <Form.Label>Ingredients</Form.Label>
                  {ingredients.map((ing, idx) => (
                    <div key={idx} className="d-flex mb-2 gap-2">
                      <Form.Control
                        placeholder="Ingredient"
                        value={ing.name}
                        onChange={e => handleIngredientChange(idx, 'name', e.target.value)}
                        required
                        style={{ flex: 2 }}
                      />
                      <Form.Control
                        placeholder="Quantity"
                        value={ing.quantity}
                        onChange={e => handleIngredientChange(idx, 'quantity', e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <Button variant="outline-danger" size="sm" onClick={() => removeIngredient(idx)} disabled={ingredients.length === 1}>×</Button>
                    </div>
                  ))}
                  <Button variant="outline-primary" size="sm" onClick={addIngredient}>Add Ingredient</Button>
                </Form.Group>
                <Form.Group className="mb-3" controlId="steps">
                  <Form.Label>Preparation Steps (one per line)</Form.Label>
                  <Form.Control as="textarea" name="steps" value={form.steps} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="media">
                  <Form.Label>Image/Video</Form.Label>
                  <Form.Control type="file" accept="image/*,video/*" onChange={handleFile} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Form.Select name="category" value={form.category} onChange={handleChange} required disabled={!!customCategory}>
                    <option value="">Select</option>
                    {Object.keys(categories).map(cat => <option key={cat}>{cat}</option>)}
                  </Form.Select>
                  <Form.Control
                    className="mt-2"
                    placeholder="Or add new category"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="subcategory">
                  <Form.Label>Sub-category</Form.Label>
                  <Form.Select name="subcategory" value={form.subcategory || ''} onChange={handleChange} disabled={!!customSubcategory || !form.category && !customCategory}>
                    <option value="">Select</option>
                    {(categories[form.category] || []).map(sub => <option key={sub}>{sub}</option>)}
                  </Form.Select>
                  <Form.Control
                    className="mt-2"
                    placeholder="Or add new sub-category"
                    value={customSubcategory}
                    onChange={e => setCustomSubcategory(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="event">
                  <Form.Label>Event Tag</Form.Label>
                  <Form.Select name="event" value={form.event} onChange={handleChange}>
                    <option value="">None</option>
                    <option>Eid</option>
                    <option>Wedding</option>
                    <option>Ramadan</option>
                  </Form.Select>
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="prepTime">
                      <Form.Label>Prep Time (min)</Form.Label>
                      <Form.Control name="prepTime" value={form.prepTime} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="servingSize">
                      <Form.Label>Serving Size</Form.Label>
                      <Form.Control name="servingSize" value={form.servingSize} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3" controlId="difficulty">
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Select name="difficulty" value={form.difficulty} onChange={handleChange}>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="nutritionalInfo">
                  <Form.Label>Nutritional Info (optional)</Form.Label>
                  <Form.Control name="nutritionalInfo" value={form.nutritionalInfo} onChange={handleChange} />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 fw-bold btn-glass mt-2" style={{ fontSize: '1.13rem' }}>Add Recipe</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddRecipe;
