import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const getCart = () => JSON.parse(localStorage.getItem('bookstore_cart') || '[]');

export default function Checkout({ onSuccess }) {
  const { user } = useAuth();
  const [address, setAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCheckout = async event => {
    event.preventDefault();
    const cart = getCart();
    if (cart.length === 0) return;

    setLoading(true);
    setMessage('');
    try {
      const books = cart.map(item => ({ bookId: item.book._id, quantity: item.quantity }));
      await api.post('/orders', { books, address, paymentMethod });
      localStorage.removeItem('bookstore_cart');
      setMessage('Order placed successfully');
      onSuccess?.();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card border-0 shadow-sm p-4" onSubmit={handleCheckout}>
      <h4 className="mb-3">Checkout</h4>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="mb-3">
        <label className="form-label">Delivery Address</label>
        <textarea className="form-control" rows="3" value={address} onChange={e => setAddress(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Payment Method</label>
        <select className="form-select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
          <option value="cash_on_delivery">Cash on Delivery</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
        </select>
      </div>
      <button className="btn btn-success" disabled={loading}>{loading ? 'Placing order...' : 'Place Order'}</button>
    </form>
  );
}
