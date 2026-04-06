import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InputField from '../components/InputField';
import Button from '../components/Button';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await register(formData.name, formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      navigate('/menu');
      return;
    }

    setError(result.message);
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <p className="section-kicker">Tạo Tài Khoản Của Bạn</p>
          <h2>Đăng Ký</h2>
          <form onSubmit={handleSubmit}>
            <InputField
              label="Họ Tên"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputField
              label="Mật Khẩu"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <InputField
              label="Nhắc lại Mật Khẩu"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {error && <div className="error-message">{error}</div>}
            <Button type="submit" variant="primary" size="large" disabled={loading}>
              {loading ? 'Creating Account...' : 'Đăng Ký'}
            </Button>
          </form>
          <p className="auth-link">
            Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
