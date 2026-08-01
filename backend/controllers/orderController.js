const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Book = require('../models/Book');

const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { books, address, paymentMethod } = req.body;

  const enrichedBooks = await Promise.all(
    books.map(async item => {
      const book = await Book.findById(item.bookId);
      if (!book) {
        throw new Error(`Book not found: ${item.bookId}`);
      }
      if (book.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${book.title}`);
      }
      book.stock -= item.quantity;
      await book.save();
      return {
        bookId: book._id,
        title: book.title,
        quantity: item.quantity,
        price: book.price
      };
    })
  );

  const totalAmount = enrichedBooks.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = await Order.create({
    userId: req.user._id,
    books: enrichedBooks,
    totalAmount,
    address,
    paymentMethod
  });

  res.status(201).json({ message: 'Order created', order });
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 }).populate('books.bookId');
  res.json({ orders });
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('userId', 'username email').populate('books.bookId');
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (req.user.role !== 'admin' && order.userId._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.json({ order });
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json({ message: 'Order status updated', order });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'username email');
  res.json({ orders });
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders };
