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
  const [clickAddCategory, setClickAddCategory] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [clickAddSubCategory, setClickAddSubCategory] = useState(false);
  const [Events, setEvents] = useState([]);
  const [customEvent, setCustomEvent] = useState('');
  const [clickAddEvent, setClickAddEvent] = useState(false);  
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/recipes/categories').then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
  axios
    .get('/api/recipes/events') // Replace with your actual API endpoint
    .then(res => setEvents(res.data)) // Populate the Events array
    .catch(err => console.error(err));
}, []);

  useEffect(() => {
  if (form.category) {
    axios
      .get(`/api/recipes/subcategories?category=${form.category}`)
      .then(res => setSubcategories(res.data))
      .catch(err => console.error(err));
  } else {
    setSubcategories([]); // Clear subcategories if no category is selected
  }
}, [form.category]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name == 'category') setCustomCategory(e.target.value);
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
    data.set('ingredients', JSON.stringify(ingredients.filter(i => i.name)));
    data.set('steps', JSON.stringify(form.steps.split('\n')));
    data.set('category', customCategory || form.category);
    data.set('subcategory', customSubcategory || form.subcategory || '');
    data.set('event', customEvent || form.event);
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
    <div style={{
      minHeight: '100vh',
      background: "url('/background.jpg') center/cover no-repeat",
      paddingTop: '100px',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.65)',
        zIndex: 1
      }} />

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={7}>
            <Card
              className="shadow-lg border-0 rounded-4"
              style = {{
                position: 'relative',
                zIndex: 2,
                background: 'rgba(30,30,30,0.93)',
                borderRadius: '2.5rem',
                padding: '2rem',
                minHeight: '80vh'
              }}
            >
              <Card.Body>
                <h2
                  className="mb-4 text-center fw-bold"
                  style={{ fontSize: '2.2rem', letterSpacing: '1px', color: '#212529' }}
                >
                  Add New Recipe
                </h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                  <Form.Group className="mb-3" controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        color: '#212529',
                        border: '1.5px solid #ffc107',
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        color: '#212529',
                        border: '1.5px solid #ffc107',
                      }}
                    />
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
                          style={{
                            background: 'rgba(255,255,255,0.08)',
                            color: '#212529',
                            border: '1.5px solid #ffc107',
                            flex: 2,
                          }}
                        />
                        <Form.Control
                          placeholder="Quantity"
                          value={ing.quantity}
                          onChange={e => handleIngredientChange(idx, 'quantity', e.target.value)}
                          style={{
                            background: 'rgba(255,255,255,0.08)',
                            color: '#212529',
                            border: '1.5px solid #ffc107',
                            flex: 1,
                          }}
                        />
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeIngredient(idx)}
                          disabled={ingredients.length === 1}
                        >
                          ×
                        </Button>
                        <Button variant="outline-warning" size="sm" onClick={addIngredient}>
                          +
                        </Button>
                      </div>
                    ))}
                   
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="steps">
                    <Form.Label>Preparation Steps (one per line)</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="steps"
                      value={form.steps}
                      onChange={handleChange}
                      required
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        color: '#212529',
                        border: '1.5px solid #ffc107',
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="media">
                    <Form.Label>Image/Video</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFile}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        color: '#212529',
                        border: '1.5px solid #ffc107',
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="category">
                    <Form.Label>Category</Form.Label>
                    <div className="d-flex align-items-center gap-2">
                      <Form.Select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                        disabled={!!customCategory}
                        style={{ flex: 1 }}
                      >
                        <option value="" hidden>Select</option>
                        {Object.keys(categories).map(cat => (
                          <option key={cat}>{cat}</option>
                        ))}
                      </Form.Select>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => setClickAddCategory(true)}
                      >
                        +
                      </Button> 
                    </div>
                      {clickAddCategory === true && (
                        <Form.Control
                          className="mt-2"
                          placeholder="Enter custom category"
                          value={customCategory}
                          onChange={e => setCustomCategory(e.target.value)}
                        />
                      )}
                  </Form.Group>
                <Form.Group className="mb-3" controlId="subcategory">
                  <Form.Label>Sub-category</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Select
                      name="subcategory"
                      value={form.subcategory}
                      onChange={handleChange}
                      required
                      disabled={!!customSubcategory}
                      style={{ flex: 1 }}
                    >
                      <option value="" hidden>Select</option>
                      {subcategories.map(sub => (
                        <option key={sub}>{sub}</option>
                      ))}
                    </Form.Select>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => setClickAddSubCategory(true)}
                    >
                      +
                    </Button>
                  </div>
                  {clickAddSubCategory === true && (
                    <Form.Control
                      className="mt-2"
                      placeholder="Enter custom sub-category"
                      value={customSubcategory}
                      onChange={e => setCustomSubcategory(e.target.value)}
                    />
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="event">
                  <Form.Label>Event Tag</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Select
                      name="event"
                      value={form.event}
                      onChange={handleChange}
                      
                      disabled={!!customEvent}
                      style={{ flex: 1 }}
                    >
                      <option value="" hidden>Select</option>
                      {Events.map(event => (
                        <option key={event}>{event}</option>
                      ))}
                    </Form.Select>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => setClickAddEvent(true)}
                    >
                      +
                    </Button>
                  </div>
                  {clickAddEvent && (
                    <Form.Control
                      className="mt-2"
                      placeholder="Enter custom event"
                      value={customEvent}
                      onChange={e => setCustomEvent(e.target.value)}
                    />
                  )}
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
                  <Button
                    variant="warning"
                    type="submit"
                    className="w-100 fw-bold mt-3"
                    style={{
                      fontSize: '1.2rem',
                      color: '#212529',
                      backgroundColor: '#ffc107',
                      border: 'none',
                    }}
                  >
                    Add Recipe
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
    </div>
  );
};

export default AddRecipe;