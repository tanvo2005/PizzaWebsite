import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from './Button';
import './Navbar.css';

// Component Navbar tái sử dụng
const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <h1>PizzaApp</h1>
        </Link>
        <ul className="navbar-nav">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/menu">Menu</Link></li>
          {user && <li><Link to="/cart">Cart ({cart.length})</Link></li>}
          {user && <li><Link to="/profile">Profile</Link></li>}
          {user?.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
        </ul>
        <div className="navbar-auth">
          {user ? (
            <div className="user-info">
              <span>Welcome, {user.name}</span>
              <Button onClick={handleLogout} variant="secondary" size="small">Logout</Button>
            </div>
          ) : (
            <div>
              <Link to="/login"><Button variant="primary" size="small">Login</Button></Link>
              <Link to="/register"><Button variant="secondary" size="small">Register</Button></Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;