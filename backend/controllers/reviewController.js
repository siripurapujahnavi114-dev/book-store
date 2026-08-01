const { validationResult } = require('express-validator');
const Review = require('../models/Review');
const Book = require('../models/Book');

const recalculateRating = async bookId => {
  const stats = await Review.aggregate([
    { $match: { bookId } },
    {
      $group: {
        _id: '$bookId',
        rating: { $avg: '$rating' },
        reviews_count: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Book.findByIdAndUpdate(bookId, {
      rating: Number(stats[0].rating.toFixed(1)),
      reviews_count: stats[0].reviews_count
    });
  } else {
    await Book.findByIdAndUpdate(bookId, { rating: 0, reviews_count: 0 });
  }
};

const createReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { bookId, rating, comment } = req.body;
  const review = await Review.findOneAndUpdate(
    { userId: req.user._id, bookId },
    { rating, comment },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await recalculateRating(bookId);
  res.status(201).json({ message: 'Review saved', review });
};

const getBookReviews = async (req, res) => {
  const reviews = await Review.find({ bookId: req.params.id }).populate('userId', 'username').sort({ createdAt: -1 });
  res.json({ reviews });
};

const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  if (req.user.role !== 'admin' && review.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Access denied' });
  }

  await Review.findByIdAndDelete(req.params.id);
  await recalculateRating(review.bookId);
  res.json({ message: 'Review deleted' });
};

module.exports = { createReview, getBookReviews, deleteReview };
