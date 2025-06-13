const Recipe = require('../models/Recipe');
const Review = require('../models/Review');
const User = require('../models/User');
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
    const { title, description, ingredients, steps, category, subcategory, event, prepTime, servingSize, difficulty, nutritionalInfo } = req.body;
    const image = req.file ? req.file.filename : null;
    const video = req.file && req.file.mimetype.startsWith('video') ? req.file.filename : null;
    const parsedIngredients = JSON.parse(ingredients); // [{name, quantity}]
    const recipe = await Recipe.create({
      user: req.user._id,
      title,
      description,
      ingredients: parsedIngredients,
      steps: JSON.parse(steps),
      image,
      video,
      category,
      subcategory,
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
    const { keyword, time, ingredient, event, category, subcategory, difficulty, rating } = req.query;

    console.log('Query Parameters:', req.query); // Debugging log

    let query = {};
    if (keyword) query.title = { $regex: keyword, $options: 'i' };
    if (ingredient) query.ingredients = { $in: [ingredient] };
    if (event) query.event = event;
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (difficulty) query.difficulty = difficulty;
    if (rating) query.rating = { $gte: Number(rating) };
    if (time) query.prepTime = { $lte: time };

    console.log('Query Object:', query); // Debugging log

    if (req.query.ids) {
      const ids = req.query.ids.split(',');
      const recipes = await Recipe.find({ _id: { $in: ids } }).populate('reviews');
      return res.json(recipes);
    }

    const recipes = await Recipe.find(query).populate('reviews');
    res.json(recipes);
  } catch (err) {
    console.error('Error fetching recipes:', err); // Debugging log
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

// Get all categories and subcategories
exports.getCategories = async (req, res) => {
  try {
    const recipes = await Recipe.find({}, 'category subcategory');
    const categories = {};
    recipes.forEach(r => {
      if (!categories[r.category]) categories[r.category] = new Set();
      if (r.subcategory) categories[r.category].add(r.subcategory);
    });
    // Convert sets to arrays
    const result = {};
    Object.entries(categories).forEach(([cat, subs]) => {
      result[cat] = Array.from(subs);
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Favorite/unfavorite recipe
exports.toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const recipeId = req.params.id;
    const idx = user.favorites.indexOf(recipeId);
    let action;
    if (idx === -1) {
      user.favorites.push(recipeId);
      action = 'added';
    } else {
      user.favorites.splice(idx, 1);
      action = 'removed';
    }
    await user.save();
    res.json({ message: `Favorite ${action}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get subcategories for a specific category
exports.getSubCategory = async (req, res) => {
  try {
    const { category } = req.query; // e.g., /api/recipes/subcategories?category=Snacks

    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const subcategories = await Recipe.distinct('subcategory', { category });

    res.json(subcategories.filter(Boolean));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all unique events
exports.getEvents = async (req, res) => {
  try {
    const events = await Recipe.distinct('event');
    console.log('EVENTS', events);
    if (!events || events.length === 0) {
      return res.status(404).json({ message: 'No events found' });
    }
    res.json(events.filter(Boolean)); // remove null/empty values
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log('ERROR FETCHING EVENTS',err)
  }
};


exports.upload = upload;
