const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('books').isArray({ min: 1 }).withMessage('Books are required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('paymentMethod').isIn(['cash_on_delivery', 'card', 'upi']).withMessage('Invalid payment method')
  ],
  asyncHandler(createOrder)
);
router.get('/', protect, asyncHandler(getMyOrders));
router.get('/admin/all', protect, admin, asyncHandler(getAllOrders));
router.get('/:id', protect, asyncHandler(getOrderById));
router.put('/:id/status', protect, admin, [body('status').isIn(['pending', 'processing', 'delivered', 'cancelled'])], asyncHandler(updateOrderStatus));

module.exports = router;
