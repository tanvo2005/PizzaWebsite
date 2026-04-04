import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { formatCurrency } from '../utils/format';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders').catch(() => ({ data: { data: { orders: [] } } })),
        ]);

        const products = productsRes.data.data?.products || [];
        const orders = ordersRes.data.data?.orders || [];
        const totalRevenue = orders.reduce((sum, order) => sum + Number.parseFloat(order.totalAmount || 0), 0);

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin">
        <Navbar />
        <div className="container">
          <div className="loading">Loading dashboard...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin">
      <Navbar />
      <div className="container">
        <h1>Admin Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">Catalog</div>
            <h3>Total Products</h3>
            <p className="stat-number">{stats.totalProducts}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">Orders</div>
            <h3>Total Orders</h3>
            <p className="stat-number">{stats.totalOrders}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">Revenue</div>
            <h3>Total Revenue</h3>
            <p className="stat-number">{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </div>

        <div className="admin-actions">
          <Link to="/admin/products" className="action-card">
            <div className="action-icon">P</div>
            <h3>Product Management</h3>
            <p>Upload images, update pricing, and manage menu availability.</p>
            <span className="action-arrow">→</span>
          </Link>
          <Link to="/admin/orders" className="action-card">
            <div className="action-icon">O</div>
            <h3>Order Management</h3>
            <p>Track incoming orders and move them through the kitchen workflow.</p>
            <span className="action-arrow">→</span>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
