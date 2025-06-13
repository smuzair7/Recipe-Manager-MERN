import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const ShoppingList = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [newListItems, setNewListItems] = useState([]);
  const [message, setMessage] = useState('');
  const [creatingList, setCreatingList] = useState(false);
  const [currentList, setCurrentList] = useState(null);

  useEffect(() => {
    fetchShoppingLists();
    fetchRecipes();
  }, []);

  const fetchShoppingLists = async () => {
    try {
      const { data } = await axios.get('/api/users/shopping-lists', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setShoppingLists(data);
    } catch (error) {
      console.error('Error fetching shopping lists:', error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const { data } = await axios.get('/api/recipes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRecipes(data);
      setSelectedRecipes([data[0]]);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleAddRecipe = () => {
    if (selectedRecipes.length >= 7) {
      setMessage('You can select a maximum of 7 recipes.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    setSelectedRecipes([...selectedRecipes, '']);
  };

  const handleUpdateRecipe = (index, recipeId) => {
    const updatedRecipes = [...selectedRecipes];
    updatedRecipes[index] = recipeId;
    setSelectedRecipes(updatedRecipes);
  };

  const handleDeleteList = (listId) => {
    console.log('Deleting Shopping List ID:', listId); // Debugging log

    axios.delete(`/api/users/shopping-lists/${listId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(() => {
      setShoppingLists(shoppingLists.filter(list => list._id !== listId));
      setMessage('Shopping list deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
      window.location.reload(); // Reload to reflect changes
    }).catch((error) => {
      console.error('Error deleting shopping list:', error); // Debugging log
    });
  };

  const generateShoppingList = () => {
    const selectedRecipeDetails = recipes.filter(recipe =>
      selectedRecipes.includes(recipe._id)
    );
    const ingredients = selectedRecipeDetails.flatMap(recipe => recipe.ingredients);
    const uniqueIngredients = Array.from(new Set(ingredients.map(i => i.name))).map(name => ({
      name,
      quantity: ingredients.find(i => i.name === name)?.quantity || '',
    }));
    setNewListItems(uniqueIngredients);
  };

  const handleSaveList = () => {
    if (!newListName || newListItems.length === 0) {
      setMessage('Please provide a name and generate the shopping list.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const newList = { name: newListName, items: newListItems };

    console.log('Saving Shopping List:', newList); // Debugging log

    axios.post('/api/users/shopping-lists', newList, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(() => {
      setShoppingLists([...shoppingLists, newList]);
      setCreatingList(false);
      setNewListName('');
      setNewListItems([]);
      setSelectedRecipes([]);
      setMessage('Shopping list created successfully!');
      setTimeout(() => setMessage(''), 3000);
    }).catch((error) => {
      console.error('Error creating shopping list:', error); // Debugging log
    });
  };

  const handleUpdateItem = (index, field, value) => {
    const updatedItems = [...newListItems];
    updatedItems[index][field] = value;
    setNewListItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    setNewListItems(newListItems.filter((_, i) => i !== index));
  };

  const handleViewList = (list) => {
    console.log('Viewing Shopping List:', list.items); // Debugging log
    setCurrentList(list);
  };



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
        padding: '3rem',
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
        Shopping List Manager
      </h2>

      {message && <Alert variant="success">{message}</Alert>}

      {/* Saved Shopping Lists */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold" style={{ color: '#ffc107' }}>
          Saved Shopping Lists
        </h4>
        <Button
          variant="warning"
          className="fw-bold"
          style={{
            backgroundColor: '#ffc107',
            border: 'none',
            color: '#212529',
          }}
          onClick={() => {setCreatingList(true); fetchRecipes();}}
        >
          +
        </Button>
      </div>
      {shoppingLists.length === 0 ? (
        <p style={{ color: '#ddd' }}>No shopping lists available.</p>
      ) : (
        <ListGroup>
          {shoppingLists.map((list, index) => (
            <ListGroup.Item
              key={index}
              className="d-flex justify-content-between align-items-center"
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#212529',
              }}
            >
              <span>{list.name}</span>
              <div>
                <Button
                  variant="info"
                  className="fw-bold me-3"
                  style={{
                    backgroundColor: '#17a2b8',
                    border: 'none',
                    color: '#fff',
                  }}
                  onClick={() => handleViewList(list)}
                >
                  View
                </Button>
                <Button
                  variant="danger"
                  className="fw-bold"
                  style={{
                    backgroundColor: '#dc3545',
                    border: 'none',
                    color: '#fff',
                  }}
                  onClick={() => handleDeleteList(list._id)}
                >
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/*View List Items*/}
      {currentList && (
        <div className="mt-5">
          <h4
            className="fw-bold mb-3"
            style={{
              color: '#ffc107',
            }}
          >
            Viewing Shopping List: {currentList.name}
          </h4>
          <ListGroup>
            {currentList.items.map((item, index) => (
              <ListGroup.Item
                key={index}
                className="d-flex justify-content-between align-items-center"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#212529',
                }}
              >
                <span>{item.name}</span>
                <span>{item.quantity}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}

      {/* Create New Shopping List */}
      {creatingList && (
        <>
          <Form.Group className="mb-4 mt-5">
            <Form.Label style={{ color: '#ffc107' }}>List Name</Form.Label>
            <Form.Control
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#212529',
              }}
            />
          </Form.Group>
          <h5 className="fw-bold mb-3" style={{ color: '#ffc107' }}>
            Select Recipes
          </h5>
          {selectedRecipes.map((recipeId, index) => (
            <div key={index} className="d-flex align-items-center mb-3">
              <Form.Select
                value={recipeId}
                onChange={(e) => handleUpdateRecipe(index, e.target.value)}
                className="me-2"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: '#212529',
                }}
              >
                <option value="">Select Recipe</option>
                {recipes.map(recipe => (
                  <option key={recipe._id} value={recipe._id}>
                    {recipe.title}
                  </option>
                ))}
              </Form.Select>
              {index === selectedRecipes.length - 1 && selectedRecipes.length < 7 && (
                <Button
                  variant="info"
                  className="fw-bold"
                  style={{
                    backgroundColor: '#17a2b8',
                    border: 'none',
                    color: '#fff',
                  }}
                  onClick={handleAddRecipe}
                >
                  +
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="warning"
            className="fw-bold mt-3"
            style={{
              backgroundColor: '#ffc107',
              border: 'none',
              color: '#212529',
            }}
            onClick={generateShoppingList}
          >
            Generate List
          </Button>

          {/* Generated Shopping List */}
          {newListItems.length > 0 && (
            <div className="mt-5">
              <h5 className="fw-bold mb-3" style={{ color: '#ffc107' }}>
                Shopping List Items
              </h5>
              <ListGroup>
                {newListItems.map((item, index) => (
                  <ListGroup.Item
                    key={index}
                    className="d-flex justify-content-between align-items-center"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      color: '#fff',
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="text"
                        value={item.name}
                        readOnly
                        className="me-2"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          color: '#212529',
                        }}
                      />
                      <Form.Control
                        type="text"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(index, 'quantity', e.target.value)}
                        className="me-2"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          color: '#212529',
                        }}
                      />
                    </div>
                    <Button
                      variant="danger"
                      className="fw-bold"
                      style={{
                        backgroundColor: '#dc3545',
                        border: 'none',
                        color: '#fff',
                      }}
                      onClick={() => handleRemoveItem(index)}
                    >
                      Remove
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Button
                variant="warning"
                className="fw-bold mt-3"
                style={{
                  backgroundColor: '#ffc107',
                  border: 'none',
                  color: '#212529',
                }}
                onClick={handleSaveList}
              >
                Save List
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default ShoppingList;