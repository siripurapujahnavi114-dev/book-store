import { useState } from 'react';

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();
    await onSubmit({ rating: Number(rating), comment });
    setComment('');
    setRating(5);
  };

  return (
    <form className="border rounded p-3 bg-white" onSubmit={handleSubmit}>
      <h5 className="mb-3">Write a Review</h5>
      <div className="mb-3">
        <label className="form-label">Rating</label>
        <select className="form-select" value={rating} onChange={e => setRating(e.target.value)}>
          {[5, 4, 3, 2, 1].map(value => <option key={value} value={value}>{value}</option>)}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Comment</label>
        <textarea className="form-control" rows="3" value={comment} onChange={e => setComment(e.target.value)} required />
      </div>
      <button className="btn btn-primary">Submit Review</button>
    </form>
  );
}
