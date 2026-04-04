import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InputField from '../components/InputField';
import Button from '../components/Button';
import './Auth.css';

// Page Login
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(formData.email, formData.password);
    if (result.success) {
      // Redirect based on user role
      if (result.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {error && <p className="error">{error}</p>}
            <Button type="submit" variant="primary" size="large">Login</Button>
          </form>
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;