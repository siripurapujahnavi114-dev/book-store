export default function OrderHistory({ orders = [] }) {
  if (!orders.length) {
    return <div className="alert alert-secondary">No orders found.</div>;
  }

  return (
    <div className="accordion" id="ordersAccordion">
      {orders.map((order, index) => (
        <div className="accordion-item" key={order._id}>
          <h2 className="accordion-header">
            <button className={`accordion-button ${index === 0 ? '' : 'collapsed'}`} type="button" data-bs-toggle="collapse" data-bs-target={`#order-${order._id}`}>
              Order {order._id.slice(-6)} - {order.status} - ₹{order.totalAmount}
            </button>
          </h2>
          <div id={`order-${order._id}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent="#ordersAccordion">
            <div className="accordion-body">
              <p className="mb-2">{order.address}</p>
              <ul className="list-group">
                {order.books.map(item => (
                  <li className="list-group-item d-flex justify-content-between" key={`${order._id}-${item.bookId?._id || item.bookId}`}>
                    <span>{item.title || item.bookId?.title || 'Book'}</span>
                    <span>{item.quantity} × ₹{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
