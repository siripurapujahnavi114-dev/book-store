import { useEffect, useState } from 'react';
import api from '../services/api';

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const response = await api.get('/admin/orders');
    setOrders(response.data.orders);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/admin/orders/${id}/status`, { status });
    await loadOrders();
  };

  return (
    <div className="card border-0 shadow-sm p-3">
      <h5>Orders</h5>
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead><tr><th>ID</th><th>User</th><th>Total</th><th>Status</th><th /></tr></thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id.slice(-6)}</td>
                <td>{order.userId?.username || 'User'}</td>
                <td>₹{order.totalAmount}</td>
                <td>{order.status}</td>
                <td className="text-end">
                  <select className="form-select form-select-sm" value={order.status} onChange={e => updateStatus(order._id, e.target.value)}>
                    {['pending', 'processing', 'delivered', 'cancelled'].map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
