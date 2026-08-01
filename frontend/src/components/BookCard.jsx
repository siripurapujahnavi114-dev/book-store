import { Link } from 'react-router-dom';

export default function BookCard({ book, onAddToCart }) {
  return (
    <div className="card h-100 card-hover border-0 shadow-sm">
      <img src={book.coverImage} alt={book.title} className="card-img-top book-cover" />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <h5 className="card-title mb-1">{book.title}</h5>
          <span className="badge text-bg-primary">₹{book.price}</span>
        </div>
        <p className="text-muted mb-1">{book.author}</p>
        <p className="text-muted small mb-2">{book.genre}</p>
        <p className="line-clamp-2 text-secondary flex-grow-1">{book.description}</p>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <small>Rating {Number(book.rating || 0).toFixed(1)}</small>
          <small>Stock {book.stock}</small>
        </div>
        <div className="d-flex gap-2 mt-3">
          <Link to={`/books/${book._id}`} className="btn btn-outline-secondary btn-sm flex-grow-1">Details</Link>
          <button className="btn btn-primary btn-sm flex-grow-1" onClick={() => onAddToCart(book)}>Add</button>
        </div>
      </div>
    </div>
  );
}
