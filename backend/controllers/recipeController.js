const Recipe = require('../models/Recipe');
const Review = require('../models/Review');
const multer = require('multer');
const path = require('path');

// Multer setup for image/video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Add new recipe
exports.addRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, steps, category, event, prepTime, servingSize, difficulty, nutritionalInfo } = req.body;
    const image = req.file ? req.file.filename : null;
    const video = req.file && req.file.mimetype.startsWith('video') ? req.file.filename : null;
    const recipe = await Recipe.create({
      user: req.user._id,
      title,
      description,
      ingredients: JSON.parse(ingredients),
      steps: JSON.parse(steps),
      image,
      video,
      category,
      event,
      prepTime,
      servingSize,
      difficulty,
      nutritionalInfo,
    });
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all recipes with search & filters
exports.getRecipes = async (req, res) => {
  try {
    const { keyword, time, ingredient, event, category, difficulty, rating } = req.query;
    let query = {};
    if (keyword) query.title = { $regex: keyword, $options: 'i' };
    if (ingredient) query.ingredients = { $in: [ingredient] };
    if (event) query.event = event;
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (rating) query.rating = { $gte: Number(rating) };
    // Time filter (e.g., under 30 min)
    if (time) query.prepTime = { $lte: time };
    if (req.query.ids) {
      // Support for shopping list: fetch recipes by IDs
      const ids = req.query.ids.split(',');
      const recipes = await Recipe.find({ _id: { $in: ids } }).populate('reviews');
      return res.json(recipes);
    }
    const recipes = await Recipe.find(query).populate('reviews');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single recipe
exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('reviews');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add review
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.create({
      user: req.user._id,
      recipe: req.params.id,
      rating,
      comment,
    });
    // Update recipe rating
    const recipe = await Recipe.findById(req.params.id);
    recipe.reviews.push(review._id);
    const allReviews = await Review.find({ recipe: req.params.id });
    recipe.rating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    await recipe.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Event-based recipes
exports.getEventRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ event: req.params.event });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Favorite, meal planner, shopping list, and social sharing logic would be added here as well.

exports.upload = upload;
