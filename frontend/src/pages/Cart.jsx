import { useState } from 'react';
import CartComponent from '../components/Cart';
import Checkout from '../components/Checkout';

export default function CartPage() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="container py-5">
      <h1 className="mb-4">Cart</h1>
      <div className="row g-4">
        <div className="col-lg-8">
          <CartComponent onChange={() => setRefresh(value => value + 1)} key={refresh} />
        </div>
        <div className="col-lg-4">
          <Checkout onSuccess={() => setRefresh(value => value + 1)} />
        </div>
      </div>
    </div>
  );
}
