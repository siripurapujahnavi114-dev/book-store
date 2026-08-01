import { useEffect, useState } from 'react';
import api from '../services/api';
import BookCard from '../components/BookCard';
import SearchFilter from '../components/SearchFilter';

const getCart = () => JSON.parse(localStorage.getItem('bookstore_cart') || '[]');
const saveCart = cart => localStorage.setItem('bookstore_cart', JSON.stringify(cart));

export default function Home() {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({ query: '', genre: '', priceMin: '', priceMax: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.query) params.set('query', filters.query);
      if (filters.genre) params.set('genre', filters.genre);
      if (filters.priceMin) params.set('priceMin', filters.priceMin);
      if (filters.priceMax) params.set('priceMax', filters.priceMax);
      const url = filters.query || filters.genre || filters.priceMin || filters.priceMax ? `/books/filter?${params.toString()}` : '/books';
      const response = await api.get(url);
      setBooks(response.data.books);
    } catch {
      setError('Unable to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleSearch = () => loadBooks();
  const addToCart = book => {
    const cart = getCart();
    const existing = cart.find(item => item.book._id === book._id);
    if (existing) existing.quantity += 1;
    else cart.push({ book, quantity: 1 });
    saveCart(cart);
  };

  return (
    <div>
      <section className="hero-gradient text-white py-5 mb-4">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 className="display-5 fw-bold">Discover your next favorite book</h1>
              <p className="lead mb-0">Explore fiction, programming, business, and self-help bestsellers.</p>
            </div>
          </div>
        </div>
      </section>
      <div className="container pb-5">
        <div className="card border-0 shadow-sm p-4 mb-4">
          <SearchFilter filters={filters} setFilters={setFilters} onSearch={handleSearch} />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <div className="text-center py-5">Loading...</div>
        ) : (
          <div className="row g-4">
            {books.map(book => (
              <div className="col-sm-6 col-lg-4 col-xl-3" key={book._id}>
                <BookCard book={book} onAddToCart={addToCart} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
