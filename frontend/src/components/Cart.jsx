import { Link } from 'react-router-dom';

const getCart = () => JSON.parse(localStorage.getItem('bookstore_cart') || '[]');
const saveCart = cart => localStorage.setItem('bookstore_cart', JSON.stringify(cart));

export default function Cart({ onChange }) {
  const cart = getCart();

  const updateQuantity = (bookId, quantity) => {
    const nextCart = cart.map(item => item.book._id === bookId ? { ...item, quantity } : item).filter(item => item.quantity > 0);
    saveCart(nextCart);
    onChange?.();
  };

  const removeItem = bookId => {
    const nextCart = cart.filter(item => item.book._id !== bookId);
    saveCart(nextCart);
    onChange?.();
  };

  const subtotal = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  if (cart.length === 0) {
    return <div className="text-center py-5"><p>Your cart is empty.</p><Link to="/" className="btn btn-primary">Continue Shopping</Link></div>;
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead><tr><th>Book</th><th>Price</th><th>Quantity</th><th>Total</th><th /></tr></thead>
        <tbody>
          {cart.map(({ book, quantity }) => (
            <tr key={book._id}>
              <td>
                <div className="d-flex align-items-center gap-3">
                  <img src={book.coverImage} alt={book.title} width="60" height="80" className="rounded" />
                  <div>
                    <div className="fw-semibold">{book.title}</div>
                    <small className="text-muted">{book.author}</small>
                  </div>
                </div>
              </td>
              <td>₹{book.price}</td>
              <td style={{ width: 140 }}>
                <input className="form-control" type="number" min="1" value={quantity} onChange={e => updateQuantity(book._id, Number(e.target.value))} />
              </td>
              <td>₹{book.price * quantity}</td>
              <td><button className="btn btn-outline-danger btn-sm" onClick={() => removeItem(book._id)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="card border-0 shadow-sm p-3 ms-auto" style={{ maxWidth: 360 }}>
        <div className="d-flex justify-content-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
        <div className="d-flex justify-content-between"><span>Tax</span><span>₹{tax.toFixed(2)}</span></div>
        <hr />
        <div className="d-flex justify-content-between fw-bold"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
      </div>
    </div>
  );
}
