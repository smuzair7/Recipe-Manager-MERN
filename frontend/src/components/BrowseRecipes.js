import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Container, Form, Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BrowseRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    event: '',
    difficulty: '',
    rating: '',
    time: '',
    ingredient: '',
    sort: '',
  });

  const [categories, setCategories] = useState({});
  const [subcategories, setSubcategories] = useState({});
  const [expandedCategory, setExpandedCategory] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/recipes/categories').then(res => setCategories(res.data)); // { category: [sub1, sub2] }
    axios.get('http://localhost:5000/api/recipes/events').then(res => setEvents(res.data)); // [ 'Eid', 'Wedding' ]

    setTimeout(() => {
      fetchRecipes(); }, 1000); // Simulate loading delay
    
  }, []);

  const fetchRecipes = async (customFilters = filters) => {
    setLoading(true);

    const params = {
      keyword: search,
      event: customFilters.event,
      category: customFilters.category,
      subcategory: customFilters.subcategory,
      difficulty: customFilters.difficulty,
      rating: customFilters.rating,
      time: customFilters.time,
      ingredient: customFilters.ingredient,
    };

    console.log('Filters used for fetching recipes:', params); // Debugging log

    try {
      const { data } = await axios.get('/api/recipes', { params });
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = e => {
    e.preventDefault();
    fetchRecipes();
  };

  const handleFilterChange = e => {
    e.preventDefault();
    setFilters({ ...filters, [e.target.name]: e.target.value });
    console.log('Filter changed:', e.target.name, e.target.value); // Debugging log
    fetchRecipes(); // Pass updated filters directly to fetchRecipes
  };

  const handleCategoryClick = async (cat) => {
    const updatedFilters = { ...filters, category: cat, subcategory: '' }; // Create updated filters object
    setExpandedCategory(expandedCategory === cat ? '' : cat);
    setFilters(updatedFilters); // Update filters state

    console.log('Selected category:', cat);
    console.log('Updated filters:', updatedFilters); // Log updated filters

    try {
      console.log('Fetching subcategories for category:', cat);
      const { data } = await axios.get('/api/recipes/subcategories', {
        params: { category: cat },
      });
      setSubcategories(data); // Update subcategories state
      console.log('Subcategories:', data);

      // Pass updated filters directly to fetchRecipes
      fetchRecipes(updatedFilters);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleSubcategorySelect = (sub) => {
    const updatedFilters = { ...filters, subcategory: sub }; // Create updated filters object
    setFilters(updatedFilters); // Update filters state

    console.log('Selected subcategory:', sub);
    console.log('Updated filters:', updatedFilters); // Log updated filters

    // Pass updated filters directly to fetchRecipes
    fetchRecipes(updatedFilters);
  };

  const renderSection = (title, filterFn) => {
    const filtered = recipes.filter(filterFn);
    return (
      <div className="mb-5">
        <h3 className="text-warning mb-3">{title}</h3>
        <Row>
          {filtered.length === 0 && (
            <p className="text-center text-light">No recipes for {title.toLowerCase()}.</p>
          )}
          {filtered.map(recipe => (
            <Col md={4} lg={3} className="mb-4" key={recipe._id}>
              <Card className="h-100 shadow-lg border-0"
                style={{
                  background: 'rgba(40,40,40,0.97)',
                  borderRadius: '2rem',
                  color: '#212529'
                }}>
                {recipe.image && <Card.Img variant="top" src={`http://localhost:5000/uploads/${recipe.image}`} style={{
                  height: 180,
                  objectFit: 'cover',
                  borderRadius: '2rem 2rem 0 0'
                }} />}
                <Card.Body>
                  <Card.Title className="fw-bold text-warning">{recipe.title}</Card.Title>
                  <Card.Text>{recipe.description.slice(0, 60)}...</Card.Text>
                  <div className="mb-2">
                    <span className="badge bg-info me-1">{recipe.category}</span>
                    {recipe.event && <span className="badge bg-warning text-dark">{recipe.event}</span>}
                  </div>
                  <div className="mb-2">
                    <span className="text-warning">{'★'.repeat(Math.round(recipe.rating || 0))}{'☆'.repeat(5 - Math.round(recipe.rating || 0))}</span>
                  </div>
                  <Button as={Link} to={`/recipe/${recipe._id}`} variant="warning" size="sm" className="fw-bold mt-2"
                    style={{ borderRadius: '1.2rem', color: '#212529' }}>
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
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

      <Container style={{
        position: 'relative',
        zIndex: 2,
        background: 'rgba(30,30,30,0.93)',
        borderRadius: '2.5rem',
        padding: '2rem',
        minHeight: '80vh'
      }}>
        <h2 className="text-center text-warning fw-bold mb-4">Browse Recipes</h2>

        <Form onSubmit={handleSearch} className="mb-4">
          <Row className="g-3">
            <Col md={12}>
              <div style={{ position: 'relative', width: '100%' }}>
                <Form.Control
                  placeholder="Search recipe by keyword, ingredient, etc."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    borderRadius: '2rem',
                    fontSize: '1.1rem',
                    background: 'rgba(255,255,255,0.08)',
                    color: '#212529',
                    border: '1.5px solid #ffc107',
                    paddingRight: 36
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSearch(e);
                  }}
                />
                <span
                  onClick={handleSearch}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#ffc107',
                    fontSize: '1.15rem',
                    zIndex: 10,
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Search"
                >
                  <i className="bi bi-search" style={{ fontWeight: 700, fontSize: '1.05rem' }}></i>
                </span>
              </div>
            </Col>

            {/* Category Dropdown */}
            <Col md={1}>
              <div style={{ position: 'relative' }}>
                <Form.Select name="event" value={filters.category} onChange={(e) => handleCategoryClick(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: '#212529',
                    border: '1.5px solid #ffc107',
                    borderRadius: '2rem',
                    paddingRight: '2rem',
                    maxHeight: '150px',
                    overflowY: 'auto' ,
                    fontSize: '10px'
                  }}>
                  <option value="" hidden>
                    Category
                  </option>
                  {Object.keys(categories).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                    <span
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#212529',
                      fontSize: '1rem'
                    }}
                  >
                    ▼
                  </span>
                  {filters.category && (
                    <span
                      onClick={() => {setFilters({ ...filters, category: '' }); fetchRecipes();}}
                      style={{
                        position: 'absolute',
                        right: '25px',
                        top: '45%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: '#212529',
                        fontSize: '10px', 
                      }}
                    >
                      ×
                    </span>
                  )}
              </div>
            </Col>

            {/* Sub Category Dropdown */}
            <Col md={1}>
              <div style={{ position: 'relative' }}>
                <Form.Select name="event" value={filters.subcategory} onChange={(e) => handleSubcategorySelect(subcategories[e.target.value])}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: '#212529',
                    border: '1.5px solid #ffc107',
                    borderRadius: '2rem',
                    paddingRight: '2rem',
                    maxHeight: '150px',
                    overflowY: 'auto' ,
                    fontSize: '10px'
                  }}
                  >
                  <option value="" hidden>
                    SubCategory
                  </option>
                  {subcategories.length!=0 && Object.keys(subcategories).map(sub => (
                    <option key={sub} value={sub}>
                      {subcategories[sub]}
                    </option>
                  ))}
                  </Form.Select>
                    <span
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#212529',
                      fontSize: '1rem'
                    }}
                  >
                    ▼
                  </span>
                  {filters.subcategory && (
                    <span
                      onClick={() => {setFilters({ ...filters, subcategory: '' }); fetchRecipes();}}
                      style={{
                        position: 'absolute',
                        right: '25px',
                        top: '45%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        color: '#212529',
                        fontSize: '10px',
                      }}
                    >
                      ×
                    </span>
                  )}
              </div>
            </Col>

            {/* Event */}
            <Col md={1}>
              <div style={{ position: 'relative' }}>
                <Form.Select name="event" value={filters.event} onChange={handleFilterChange}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: '#212529',
                    border: '1.5px solid #ffc107',
                    borderRadius: '2rem',
                    paddingRight: '2rem',
                    maxHeight: '150px',
                    overflowY: 'auto' ,
                    fontSize: '10px'
                  }}>
                  <option value="" hidden>
                    Event
                  </option>
                  {events.map(evt => <option key={evt} value={evt}>{evt}</option>)}
                </Form.Select>
                <span
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#212529',
                    fontSize: '1rem'
                  }}
                >
                  ▼
                </span>
                {filters.event && (
                  <span
                    onClick={() => {setFilters({ ...filters, event: '' }); fetchRecipes();}}
                    style={{
                      position: 'absolute',
                      right: '25px',
                      top: '45%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#212529',
                      fontSize: '10px',
                    }}
                  >
                    ×
                  </span>
                )}
              </div>
            </Col>

            {/* Difficulty */}
            <Col md={1}>
              <div style={{ position: 'relative' }}>
                <Form.Select name="difficulty" value={filters.difficulty} onChange={handleFilterChange}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: '#212529',
                    border: '1.5px solid #ffc107',
                    borderRadius: '2rem',
                    paddingRight: '2rem',
                    maxHeight: '150px',
                    overflowY: 'auto' ,
                    fontSize: '10px'
                  }}>
                  <option value="" hidden>
                    Difficulty
                  </option>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </Form.Select>
                <span
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#212529',
                      fontSize: '1rem'
                    }}
                  >
                    ▼
                </span> 
                {filters.difficulty && (
                  <span
                    onClick={() => {setFilters({ ...filters, difficulty: '' }); fetchRecipes();}}
                    style={{
                      position: 'absolute',
                      right: '25px',
                      top: '45%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#212529',
                      fontSize: '10px',
                    }}
                  >
                    ×
                  </span>
                )}
              </div>
            </Col>

            {/* Time */}
            <Col md={1}>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  type="number"
                  name="time"
                  placeholder="Time(min)"
                  min="1"
                  value={filters.time}
                  onChange={handleFilterChange}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: '#212529',
                    border: '1.5px solid #ffc107',
                    borderRadius: '2rem',
                    fontSize: '10px',
                  }}
                />
                {filters.time && (
                  <span
                    onClick={() => {setFilters({ ...filters, time: '' }); fetchRecipes();}}
                    style={{
                      position: 'absolute',
                      right: '25px',
                      top: '45%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#212529',
                      fontSize: '10px',
                    }}
                  >
                    ×
                  </span>
                )}
              </div>
            </Col>

            {/* Ingredient */}
            <Col md={1}>
              <div style={{ position: 'relative' }}>
                <Form.Control
                  name="ingredient"
                  value={filters.ingredient}
                  onChange={handleFilterChange}
                  placeholder="Ingredient"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: '#212529',
                    border: '1.5px solid #ffc107',
                    borderRadius: '2rem',
                    fontSize: '10px',
                  }}
                />
                {filters.ingredient && (
                  <span
                    onClick={() => {setFilters({ ...filters, ingredient: '' }); fetchRecipes();}}
                    style={{
                      position: 'absolute',
                      right: '25px',
                      top: '45%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#212529',
                      fontSize: '10px',
                    }}
                  >
                    ×
                  </span>
                )}
              </div>
            </Col>

            {/* Rating */}
            <Col md={1}>
              <div style={{ position: 'relative' }}>
                <Form.Select name="rating" value={filters.rating} onChange={handleFilterChange}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: '#212529',
                    border: '1.5px solid #ffc107',
                    borderRadius: '2rem',
                    fontSize: '10px',
                  }}>
                  <option value="" hidden>Rating</option>
                  <option value="4">4+</option>
                  <option value="3">3+</option>
                  <option value="2">2+</option>
                  <option value="1">1+</option>
                </Form.Select>
                <span
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#212529',
                      fontSize: '1rem'
                    }}
                  >
                    ▼
                  </span>
                  {filters.rating && (
                  <span
                    onClick={() => {setFilters({ ...filters, rating: '' }); fetchRecipes();}}
                    style={{
                      position: 'absolute',
                      right: '25px',
                      top: '45%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#212529',
                      fontSize: '10px',
                    }}
                  >
                    ×
                  </span>
                )}
              </div>
            </Col>
          


        {/* Sort */}
            <Col md={1} lg={1}>
              <div style={{ position: 'relative' }}>
                <Form.Select 
                  name="sort" 
                  value={filters.sort} 
                  onChange={handleFilterChange}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: '#212529',
                    border: '1.5px solid #ffc107',
                    borderRadius: '2rem',
                    fontSize: '10px',
                  }}
                >
                  <option value="" hidden>Sort</option>
                  <option value="rating-desc">Highest Rating</option>
                  <option value="rating-asc">Lowest Rating</option>
                  <option value="time-asc">Quickest First</option>
                  <option value="time-desc">Longest First</option>
                </Form.Select>
                <span
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#212529',
                      fontSize: '1rem'
                    }}
                  >
                    ▼
                  </span>
                {filters.sort && (
                  <span
                    onClick={() => {setFilters({ ...filters, sort: '' }); fetchRecipes();}}
                    style={{
                      position: 'absolute',
                      right: '25px',
                      top: '45%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#212529',
                      fontSize: '10px',
                    }}
                  >
                    ×
                  </span>
                )}
              </div>
            </Col>
          </Row>
        </Form>

        {/* Recipe Sections */}
        {search || Object.values(filters).some(filter => filter) ? (
          <Row>
            {recipes.length === 0 ? (
              <p className="text-center text-light">No recipes found.</p>
            ) : (
              recipes.map(recipe => (
                <Col md={4} lg={3} className="mb-4" key={recipe._id}>
                  <Card className="h-100 shadow-lg border-0"
                    style={{
                      background: 'rgba(40,40,40,0.97)',
                      borderRadius: '2rem',
                      color: '#212529'
                    }}>
                    {recipe.image && <Card.Img variant="top" src={`http://localhost:5000/uploads/${recipe.image}`} style={{
                      height: 180,
                      objectFit: 'cover',
                      borderRadius: '2rem 2rem 0 0'
                    }} />}
                    <Card.Body>
                      <Card.Title className="fw-bold text-warning">{recipe.title}</Card.Title>
                      <Card.Text>{recipe.description.slice(0, 60)}...</Card.Text>
                      <div className="mb-2">
                        <span className="badge bg-info me-1">{recipe.category}</span>
                        {recipe.event && <span className="badge bg-warning text-dark">{recipe.event}</span>}
                      </div>
                      <div className="mb-2">
                        <span className="text-warning">{'★'.repeat(Math.round(recipe.rating || 0))}{'☆'.repeat(5 - Math.round(recipe.rating || 0))}</span>
                      </div>
                      <Button as={Link} to={`/recipe/${recipe._id}`} variant="warning" size="sm" className="fw-bold mt-2"
                        style={{ borderRadius: '1.2rem', color: '#212529' }}>
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        ) : (
          <>
            {renderSection('Breakfast', r => r.event === 'Breakfast')}
            {renderSection('Eid  Special', r => r.event === 'Eid')}
            {renderSection('Quick Recipes (Under 15 Minutes)', r => parseInt(r.prepTime) <= 15)}
            {renderSection('Highly Rated', r => r.rating >= 4)}
            {renderSection('Other', r => {
              // Exclude recipes already shown in other categories
              const isInOtherCategories =
                r.event === 'Breakfast' ||
                r.event === 'Eid' ||
                parseInt(r.prepTime) <= 15 ||
                r.rating >= 4;
              return !isInOtherCategories;
            })}
          </>
        )}
      </Container>
    </div>
  );
};

export default BrowseRecipes;
