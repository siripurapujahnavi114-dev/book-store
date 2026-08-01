export default function SearchFilter({ filters, setFilters, onSearch }) {
  return (
    <div className="row g-3 align-items-end">
      <div className="col-md-4">
        <label className="form-label">Search</label>
        <input
          type="text"
          className="form-control"
          value={filters.query}
          onChange={e => setFilters({ ...filters, query: e.target.value })}
          placeholder="Title, author, genre"
        />
      </div>
      <div className="col-md-2">
        <label className="form-label">Genre</label>
        <input type="text" className="form-control" value={filters.genre} onChange={e => setFilters({ ...filters, genre: e.target.value })} />
      </div>
      <div className="col-md-2">
        <label className="form-label">Min Price</label>
        <input type="number" className="form-control" value={filters.priceMin} onChange={e => setFilters({ ...filters, priceMin: e.target.value })} />
      </div>
      <div className="col-md-2">
        <label className="form-label">Max Price</label>
        <input type="number" className="form-control" value={filters.priceMax} onChange={e => setFilters({ ...filters, priceMax: e.target.value })} />
      </div>
      <div className="col-md-2">
        <button className="btn btn-dark w-100" onClick={onSearch}>Search</button>
      </div>
    </div>
  );
}
