const express = require('express');
const { body } = require('express-validator');
const { createReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('bookId').notEmpty().withMessage('Book is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required')
  ],
  asyncHandler(createReview)
);
router.delete('/:id', protect, asyncHandler(deleteReview));

module.exports = router;
