import { useNavigate, Link } from 'react-router-dom';
import { FaBook, FaShoppingCart, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <FaBook className="me-2" />
          BookStore
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/cart"><FaShoppingCart className="me-1" />Cart</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/orders">Orders</Link></li>
            {user?.role === 'admin' && (
              <li className="nav-item"><Link className="nav-link" to="/admin"><FaUserShield className="me-1" />Admin</Link></li>
            )}
            {user ? (
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm ms-lg-2" onClick={handleLogout}>Logout</button>
              </li>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="btn btn-primary btn-sm ms-lg-2" to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
