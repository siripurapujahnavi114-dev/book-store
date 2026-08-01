import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ReviewForm from '../components/ReviewForm';
import { useAuth } from '../context/AuthContext';

const getCart = () => JSON.parse(localStorage.getItem('bookstore_cart') || '[]');
const saveCart = cart => localStorage.setItem('bookstore_cart', JSON.stringify(cart));

export default function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    const response = await api.get(`/books/${id}`);
    setBook(response.data.book);
    setReviews(response.data.reviews);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const addToCart = () => {
    const cart = getCart();
    const existing = cart.find(item => item.book._id === book._id);
    if (existing) existing.quantity += 1;
    else cart.push({ book, quantity: 1 });
    saveCart(cart);
    setMessage('Added to cart');
  };

  const submitReview = async payload => {
    await api.post('/reviews', { bookId: id, ...payload });
    await loadData();
  };

  if (!book) return <div className="container py-5 text-center">Loading...</div>;

  return (
    <div className="container py-5">
      {message && <div className="alert alert-success">{message}</div>}
      <div className="row g-4">
        <div className="col-md-5">
          <img src={book.coverImage} alt={book.title} className="img-fluid rounded shadow-sm w-100" />
        </div>
        <div className="col-md-7">
          <h1 className="mb-2">{book.title}</h1>
          <p className="text-muted mb-1">{book.author}</p>
          <p className="badge text-bg-secondary">{book.genre}</p>
          <p className="fs-4 fw-bold text-primary mt-3">₹{book.price}</p>
          <p>{book.description}</p>
          <p>Rating: {Number(book.rating || 0).toFixed(1)} | Reviews: {book.reviews_count}</p>
          <button className="btn btn-primary mb-4" onClick={addToCart}>Add to Cart</button>
          <h4>Reviews</h4>
          <div className="list-group mb-4">
            {reviews.length === 0 && <div className="text-muted">No reviews yet.</div>}
            {reviews.map(review => (
              <div className="list-group-item" key={review._id}>
                <div className="d-flex justify-content-between">
                  <strong>{review.userId?.username || 'User'}</strong>
                  <span>{review.rating}/5</span>
                </div>
                <div>{review.comment}</div>
              </div>
            ))}
          </div>
          {user ? <ReviewForm onSubmit={submitReview} /> : <div className="alert alert-info">Login to write a review.</div>}
        </div>
      </div>
    </div>
  );
}
