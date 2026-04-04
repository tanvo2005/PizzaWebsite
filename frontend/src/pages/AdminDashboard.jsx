import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Admin.css';

// Admin Dashboard Page
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch basic stats
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders').catch(() => ({ data: { data: { orders: [] } } }))
        ]);

        const products = productsRes.data.data?.products || [];
        const orders = ordersRes.data.data?.orders || [];

        // Calculate total revenue
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0);

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue: totalRevenue
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
            <div className="stat-icon">📦</div>
            <h3>Total Products</h3>
            <p className="stat-number">{stats.totalProducts}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <h3>Total Orders</h3>
            <p className="stat-number">{stats.totalOrders}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <h3>Total Revenue</h3>
            <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="admin-actions">
          <Link to="/admin/products" className="action-card">
            <div className="action-icon">🍕</div>
            <h3>Product Management</h3>
            <p>Manage your pizza menu and inventory</p>
            <span className="action-arrow">→</span>
          </Link>
          <Link to="/admin/orders" className="action-card">
            <div className="action-icon">🚚</div>
            <h3>Order Management</h3>
            <p>View and manage customer orders</p>
            <span className="action-arrow">→</span>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;