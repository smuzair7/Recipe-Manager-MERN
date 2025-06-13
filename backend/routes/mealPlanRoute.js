const express = require('express');
const router = express.Router();
const MealPlan = require('../models/MealPlan');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// POST /api/mealplan/add
// Create a new meal plan (week plan) or update an existing one
router.post('/add', protect, async (req, res) => {
  try {
    const { name, week } = req.body;
    if (!name || !Array.isArray(week) || week.length !== 7) {
      return res.status(400).json({ message: 'Invalid meal plan format. Must include name and 7-day week.' });
    }

    // Create the meal plan
    const newMealPlan = await MealPlan.create({
      name,
      user: req.user._id,
      week,
    });

    // Update the user document with this new meal plan ID
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { mealPlans: newMealPlan._id } },
      { new: true }
    );

    res.status(200).json({ message: 'Meal plan created', mealPlan: newMealPlan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET /api/mealplan/week
// Get all meal plans for a user
router.get('/week', protect, async (req, res) => {
  try {
    const plans = await MealPlan.find({ user: req.user._id })
      .populate({
        path: 'week.recipe',
        select: 'title ingredients image',
      })
      .sort({ createdAt: -1 });

    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/mealplan/shopping-list
// Consolidate ingredients across all meal plans
router.get('/shopping-list', protect, async (req, res) => {
  try {
    const plans = await MealPlan.find({ user: req.user._id }).populate({
      path: 'week.recipe',
      select: 'ingredients',
    });

    const ingredientMap = {};

    plans.forEach(plan => {
      plan.week.forEach(day => {
        if (day.recipe && day.recipe.ingredients) {
          day.recipe.ingredients.forEach(({ name, quantity }) => {
            if (ingredientMap[name]) {
              ingredientMap[name].push(quantity);
            } else {
              ingredientMap[name] = [quantity];
            }
          });
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


// DELETE /api/mealplans/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const mealPlanId = req.params.id;

    // Find the meal plan and ensure it belongs to the user
    const plan = await MealPlan.findOne({ _id: mealPlanId, user: req.user._id });
    if (!plan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    // Remove meal plan from MealPlan collection
    await MealPlan.deleteOne({ _id: mealPlanId });

    // Also remove mealPlan reference from user's mealPlans array
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { mealPlans: mealPlanId } }
    );

    res.json({ message: 'Meal plan deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
