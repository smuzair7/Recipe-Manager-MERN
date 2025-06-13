const mongoose = require('mongoose');

const shoppingItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true }
});

const shoppingListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [shoppingItemSchema]
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  mealPlans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MealPlan' }],
  shoppingLists: [shoppingListSchema] // ✅ Add this line
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
