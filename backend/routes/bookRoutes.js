const express = require('express');
const { body } = require('express-validator');
const upload = require('../config/multer');
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
  filterBooks
} = require('../controllers/bookController');
const { getBookReviews } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(getBooks));
router.get('/search', asyncHandler(searchBooks));
router.get('/filter', asyncHandler(filterBooks));
router.get('/:id', asyncHandler(getBookById));
router.get('/:id/reviews', asyncHandler(getBookReviews));
router.post(
  '/',
  protect,
  admin,
  upload.single('coverImage'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('genre').notEmpty().withMessage('Genre is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be greater than or equal to 0'),
    body('description').notEmpty().withMessage('Description is required')
  ],
  asyncHandler(createBook)
);
router.put(
  '/:id',
  protect,
  admin,
  upload.single('coverImage'),
  [body('price').optional().isFloat({ min: 0 }).withMessage('Price must be valid')],
  asyncHandler(updateBook)
);
router.delete('/:id', protect, admin, asyncHandler(deleteBook));

module.exports = router;
