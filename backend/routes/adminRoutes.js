const express = require('express');
const { body } = require('express-validator');
const upload = require('../config/multer');
const { dashboard, getUsers, createBook, updateBook, deleteBook } = require('../controllers/adminController');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.use(protect, admin);

router.get('/dashboard', asyncHandler(dashboard));
router.get('/users', asyncHandler(getUsers));
router.get('/orders', asyncHandler(getAllOrders));
router.post(
  '/books',
  upload.single('coverImage'),
  [
    body('title').notEmpty(),
    body('author').notEmpty(),
    body('genre').notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('description').notEmpty()
  ],
  asyncHandler(createBook)
);
router.put('/books/:id', upload.single('coverImage'), asyncHandler(updateBook));
router.delete('/books/:id', asyncHandler(deleteBook));
router.put('/orders/:id/status', [body('status').isIn(['pending', 'processing', 'delivered', 'cancelled'])], asyncHandler(updateOrderStatus));

module.exports = router;
