const express = require('express');
const { addRecipe, getRecipes, getRecipe, addReview, getEventRecipes, upload } = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, upload.single('media'), addRecipe);
router.get('/', getRecipes);
router.get('/:id', getRecipe);
router.post('/:id/review', protect, addReview);
router.get('/event/:event', getEventRecipes);

module.exports = router;
