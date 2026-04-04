import './SearchBar.css';

const SearchBar = ({ value, onChange, onSubmit }) => (
  <form className="search-bar" onSubmit={onSubmit}>
    <span className="search-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    </span>
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search pizzas, toppings..."
      aria-label="Search products"
    />
    <button type="submit">Search</button>
  </form>
);

export default SearchBar;
