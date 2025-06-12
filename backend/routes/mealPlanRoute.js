// mealPlanRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// POST /api/mealplan/add
router.post('/add', protect, async (req, res) => {
  try {
    const { date, recipeId } = req.body;

    const user = await User.findById(req.user._id);
    user.mealPlans.push({ date, recipe: recipeId });
    await user.save();

    res.status(200).json({ message: 'Meal added to plan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/mealplan/week
router.get('/week', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'mealPlans.recipe',
        select: 'title ingredients image',
      });

    res.json(user.mealPlans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/mealplan/shopping-list
router.get('/shopping-list', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'mealPlans.recipe',
      select: 'ingredients',
    });

    const ingredientMap = {};

    user.mealPlans.forEach(plan => {
      plan.recipe.ingredients.forEach(({ name, quantity }) => {
        if (ingredientMap[name]) {
          ingredientMap[name].push(quantity);
        } else {
          ingredientMap[name] = [quantity];
        }
      });
    });

    const list = Object.entries(ingredientMap).map(([name, quantities]) => ({
      name,
      quantities,
    }));

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
