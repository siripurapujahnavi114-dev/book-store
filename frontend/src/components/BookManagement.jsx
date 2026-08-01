import { useEffect, useState } from 'react';
import api from '../services/api';

const initialForm = { title: '', author: '', genre: '', price: '', description: '', coverImage: '', stock: '' };

export default function BookManagement() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const loadBooks = async () => {
    const response = await api.get('/books?limit=100');
    setBooks(response.data.books);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const saveBook = async event => {
    event.preventDefault();
    setError('');
    const payload = new FormData();
    payload.append('title', form.title);
    payload.append('author', form.author);
    payload.append('genre', form.genre);
    payload.append('price', String(Number(form.price)));
    payload.append('description', form.description);
    payload.append('stock', String(Number(form.stock)));
    if (form.coverImageFile) payload.append('coverImage', form.coverImageFile);

    try {
      if (form._id) await api.put(`/books/${form._id}`, payload);
      else await api.post('/books', payload);
      setForm(initialForm);
      await loadBooks();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save book');
    }
  };

  const editBook = book => setForm({ ...book, coverImageFile: null });
  const deleteBook = async id => { await api.delete(`/books/${id}`); await loadBooks(); };

  return (
    <div className="row g-4">
      <div className="col-lg-5">
        <form className="card border-0 shadow-sm p-3" onSubmit={saveBook}>
          <h5>{form._id ? 'Edit Book' : 'Add Book'}</h5>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <div className="row g-2">
            {['title', 'author', 'genre', 'price', 'stock'].map(field => (
              <div className="col-12" key={field}>
                <input className="form-control" placeholder={field} value={form[field] || ''} onChange={e => setForm({ ...form, [field]: e.target.value })} required={['title', 'author', 'genre', 'price'].includes(field)} />
              </div>
            ))}
            <div className="col-12">
              <label className="form-label mb-1">Cover Image</label>
              <input
                className="form-control"
                type="file"
                accept="image/*"
                onChange={e => setForm({ ...form, coverImageFile: e.target.files?.[0] || null })}
              />
              {form.coverImage && !form.coverImageFile && (
                <small className="text-muted d-block mt-1">Current image is already saved.</small>
              )}
            </div>
            <div className="col-12">
              <textarea className="form-control" rows="4" placeholder="description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="col-12"><button className="btn btn-primary w-100">Save</button></div>
          </div>
        </form>
      </div>
      <div className="col-lg-7">
        <div className="table-responsive card border-0 shadow-sm p-3">
          <table className="table align-middle mb-0">
            <thead><tr><th>Title</th><th>Stock</th><th>Price</th><th /></tr></thead>
            <tbody>
              {books.map(book => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.stock}</td>
                  <td>₹{book.price}</td>
                  <td className="text-end">
                    <button type="button" className="btn btn-outline-secondary btn-sm me-2" onClick={() => editBook(book)}>Edit</button>
                    <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => deleteBook(book._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
