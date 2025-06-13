const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "My Healthy Week"
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  week: [{
    date: { type: String, required: true }, // e.g., '2025-06-14'
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('MealPlan', mealPlanSchema);