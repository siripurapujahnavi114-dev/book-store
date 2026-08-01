import { useEffect, useState } from 'react';
import api from '../services/api';
import OrderHistoryComponent from '../components/OrderHistory';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      const response = await api.get('/orders');
      setOrders(response.data.orders);
    };

    loadOrders();
  }, []);

  return (
    <div className="container py-5">
      <h1 className="mb-4">Order History</h1>
      <OrderHistoryComponent orders={orders} />
    </div>
  );
}
