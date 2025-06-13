const express = require('express');
const { register, login, getProfile, getFavorites } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const User = require('../models/User');

// Get all shopping lists for a user
router.get('/shopping-lists',protect,  async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in req.user
    console.log('GET Shopping Lists Request:', req.user); // Debugging log
    console.log('User ID:', userId); // Debugging log
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const user = await User.findById(userId).select('shoppingLists');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.shoppingLists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shopping lists', error });
  }
});

router.post('/shopping-lists', protect, async (req, res) => {
  try {
    const userId = req.user.id; // Ensure req.user.id is available
    const { name, items } = req.body;

    console.log('User ID:', userId); // Debugging log
    console.log('Request Body:', req.user, '\n',req.body); // Debugging log

    if (!name || !items || items.length === 0) {
      return res.status(400).json({ message: 'Name and items are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User Found:', user); // Debugging log

    user.shoppingLists.push({ name, items });
    await user.save();

    res.status(201).json({ message: 'Shopping list saved successfully', shoppingLists: user.shoppingLists });
  } catch (error) {
    console.error('Error saving shopping list:', error); // Debugging log
    res.status(500).json({ message: 'Error saving shopping list', error });
  }
});

// Delete a shopping list
router.delete('/shopping-lists/:listId',protect,  async (req, res) => {
  try {
    console.log('Delete Shopping List Request:', req.params); // Debugging log  
    const userId = req.user._id; // Assuming user ID is available in req.user
    const { listId } = req.params;
    console.log('User ID:', userId); // Debugging log
    console.log('List ID:', listId); // Debugging log

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.shoppingLists = user.shoppingLists.filter(list => list._id.toString() !== listId);
    await user.save();

    res.json({ message: 'Shopping list deleted successfully', shoppingLists: user.shoppingLists });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting shopping list', error });
  }
});

router.get('/favorites', protect, getFavorites);

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

module.exports = router;
