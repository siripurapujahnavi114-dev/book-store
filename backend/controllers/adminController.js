const User = require('../models/User');
const Book = require('../models/Book');
const Order = require('../models/Order');
const Review = require('../models/Review');

const buildCoverImageUrl = (req, file) => {
  if (!file) return undefined;
  return `${req.protocol}://${req.get('host')}/api/uploads/${file.filename}`;
};

const dashboard = async (req, res) => {
  const [users, books, orders, reviews, pendingOrders] = await Promise.all([
    User.countDocuments(),
    Book.countDocuments(),
    Order.countDocuments(),
    Review.countDocuments(),
    Order.countDocuments({ status: 'pending' })
  ]);

  const sales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
  ]);

  res.json({
    stats: {
      users,
      books,
      orders,
      reviews,
      pendingOrders,
      totalSales: sales[0]?.totalSales || 0
    }
  });
};

const getUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ users });
};

const createBook = async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.coverImage = buildCoverImageUrl(req, req.file);
  }
  const book = await Book.create(payload);
  res.status(201).json({ message: 'Book created', book });
};

const updateBook = async (req, res) => {
  const payload = { ...req.body };
  if (req.file) {
    payload.coverImage = buildCoverImageUrl(req, req.file);
  }
  const book = await Book.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json({ message: 'Book updated', book });
};

const deleteBook = async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  await Review.deleteMany({ bookId: req.params.id });
  res.json({ message: 'Book deleted' });
};

module.exports = { dashboard, getUsers, createBook, updateBook, deleteBook };
