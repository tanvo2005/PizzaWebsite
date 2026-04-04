import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/useCart';
import SearchBar from './SearchBar';
import Button from './Button';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.startsWith('/admin');
  const [searchTerm, setSearchTerm] = useState('');
  const currentMenuQuery = location.pathname === '/menu'
    ? new URLSearchParams(location.search).get('q') || ''
    : searchTerm;

  const navLinks = useMemo(() => ([
    { label: 'Home', to: '/' },
    { label: 'Menu', to: '/menu' },
    { label: 'About', to: '/about' },
    ...(user ? [{ label: `Cart (${itemCount})`, to: '/cart' }] : []),
    ...(user?.role === 'admin' ? [{ label: 'Admin', to: '/admin' }] : []),
  ]), [itemCount, user]);

  const updateMenuQuery = (value, replace = false) => {
    const params = new URLSearchParams(location.search);
    const normalized = value.trim();

    if (normalized) {
      params.set('q', normalized);
    } else {
      params.delete('q');
    }

    navigate(
      {
        pathname: '/menu',
        search: params.toString() ? `?${params.toString()}` : '',
      },
      { replace }
    );
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);

    if (location.pathname === '/menu') {
      updateMenuQuery(value, true);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    updateMenuQuery(searchTerm, false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar-shell">
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="navbar-brand">
            <span className="brand-badge">Pizza</span>
            <div>
              <strong>Green Slice</strong>
              <span>Hot, fast, made fresh.</span>
            </div>
          </Link>

          {!isAdminPage && (
            <SearchBar
              value={currentMenuQuery}
              onChange={handleSearchChange}
              onSubmit={handleSearchSubmit}
            />
          )}

          <div className="navbar-actions">
            <ul className="navbar-nav">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>

            <div className="navbar-auth">
              {user ? (
                <div className="user-info">
                  <span>Hi, {user.name}</span>
                  <Button onClick={handleLogout} variant="secondary" size="small">Logout</Button>
                </div>
              ) : (
                <div className="auth-links">
                  <Link to="/login"><Button variant="outline" size="small">Login</Button></Link>
                  <Link to="/register"><Button variant="primary" size="small">Register</Button></Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
