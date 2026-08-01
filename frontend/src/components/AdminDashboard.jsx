export default function AdminDashboard({ stats }) {
  const cards = [
    ['Users', stats.users],
    ['Books', stats.books],
    ['Orders', stats.orders],
    ['Reviews', stats.reviews],
    ['Pending Orders', stats.pendingOrders],
    ['Total Sales', `₹${stats.totalSales}`]
  ];

  return (
    <div className="row g-3">
      {cards.map(([label, value]) => (
        <div className="col-md-4" key={label}>
          <div className="card border-0 shadow-sm p-3 h-100">
            <div className="text-muted">{label}</div>
            <div className="fs-3 fw-bold">{value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
