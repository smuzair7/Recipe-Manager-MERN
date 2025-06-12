const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  mealPlans: [
  {
    date: { type: String, required: true }, // e.g., '2025-06-14'
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true }
  }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
