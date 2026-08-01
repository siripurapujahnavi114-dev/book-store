import { useEffect, useState } from 'react';
import api from '../services/api';
import AdminDashboard from '../components/AdminDashboard';
import BookManagement from '../components/BookManagement';
import OrderManagement from '../components/OrderManagement';

export default function AdminPage() {
  const [stats, setStats] = useState({ users: 0, books: 0, orders: 0, reviews: 0, pendingOrders: 0, totalSales: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats);
    };

    loadStats();
  }, []);

  return (
    <div className="container py-5">
      <h1 className="mb-4">Admin Dashboard</h1>
      <AdminDashboard stats={stats} />
      <div className="my-4"><BookManagement /></div>
      <OrderManagement />
    </div>
  );
}
