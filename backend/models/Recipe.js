const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, default: '' }
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [ingredientSchema],
  steps: [{ type: String, required: true }],
  image: { type: String },
  video: { type: String },
  category: { type: String, required: true },
  subcategory: { type: String },
  event: { type: String },
  prepTime: { type: String },
  servingSize: { type: String },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  nutritionalInfo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
