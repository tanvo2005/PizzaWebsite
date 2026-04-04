import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InputField from '../components/InputField';
import Button from '../components/Button';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate(result.user?.role === 'admin' ? '/admin' : '/menu');
      return;
    }

    setError(result.message);
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <p className="section-kicker">Welcome back</p>
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
          <p>Don&apos;t have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
