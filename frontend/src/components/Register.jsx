import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 620 }}>
      <div className="card shadow-sm border-0 p-4">
        <h2 className="mb-4">Register</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6"><input className="form-control" placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required /></div>
          <div className="col-md-6"><input className="form-control" type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
          <div className="col-md-6"><input className="form-control" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div>
          <div className="col-md-6"><input className="form-control" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="col-12"><textarea className="form-control" placeholder="Address" rows="3" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
          <div className="col-12"><button className="btn btn-primary" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button></div>
        </form>
      </div>
    </div>
  );
}
