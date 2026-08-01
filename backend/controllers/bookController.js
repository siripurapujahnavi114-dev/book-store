const { validationResult } = require('express-validator');
const Book = require('../models/Book');
const Review = require('../models/Review');
const path = require('path');

const buildBookQuery = query => {
  const filter = {};

  if (query.query) {
    filter.$or = [
      { title: new RegExp(query.query, 'i') },
      { author: new RegExp(query.query, 'i') },
      { genre: new RegExp(query.query, 'i') }
    ];
  }

  if (query.genre) {
    filter.genre = new RegExp(query.genre, 'i');
  }

  if (query.author) {
    filter.author = new RegExp(query.author, 'i');
  }

  if (query.title) {
    filter.title = new RegExp(query.title, 'i');
  }

  if (query.priceMin || query.priceMax) {
    filter.price = {};
    if (query.priceMin) filter.price.$gte = Number(query.priceMin);
    if (query.priceMax) filter.price.$lte = Number(query.priceMax);
  }

  if (query.rating) {
    filter.rating = { $gte: Number(query.rating) };
  }

  return filter;
};

const buildCoverImageUrl = (req, file) => {
  if (!file) return undefined;
  return `${req.protocol}://${req.get('host')}/api/uploads/${file.filename}`;
};

const getBooks = async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 12);
  const skip = (page - 1) * limit;
  const filter = buildBookQuery(req.query);
// .skip(skip).limit(limit)
  const [books, total] = await Promise.all([
    Book.find(filter).sort({ createdAt: -1 }),
    Book.countDocuments(filter)
  ]);

  res.json({
    books,
    page,
    pages: Math.ceil(total / limit),
    total
  });
};

const getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const reviews = await Review.find({ bookId: book._id }).populate('userId', 'username');
  res.json({ book, reviews });
};

const createBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const payload = { ...req.body };
  if (req.file) {
    payload.coverImage = buildCoverImageUrl(req, req.file);
  }
  const book = await Book.create(payload);
  res.status(201).json({ message: 'Book created', book });
};

const updateBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

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

const searchBooks = async (req, res) => {
  const query = req.query.query || '';
  const books = await Book.find({
    $or: [
      { title: new RegExp(query, 'i') },
      { author: new RegExp(query, 'i') },
      { genre: new RegExp(query, 'i') }
    ]
  }).limit(20);

  res.json({ books });
};

const filterBooks = async (req, res) => {
  const filter = buildBookQuery(req.query);
  const books = await Book.find(filter).sort({ rating: -1, createdAt: -1 });
  res.json({ books });
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
  filterBooks
};
