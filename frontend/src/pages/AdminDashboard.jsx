import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxArchive, FaReceipt } from 'react-icons/fa6';
import api from '../utils/api';
import { formatCurrency } from '../utils/format';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Admin.css';

const DashboardActionCard = ({ icon, title, description, to }) => (
  // Giữ nguyên Link để card vẫn clickable toàn bộ, chỉ cập nhật nội dung UI.
  <Link to={to} className="action-card">
    <div className="action-icon">{icon}</div>
    <div className="action-content">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
    <button type="button" className="action-button">
      Quản lý ngay
    </button>
  </Link>
);

const AdminDashboard = () => {
  // Giữ nguyên logic và dữ liệu, chỉ làm mới giao diện.
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
          <div className="loading">Đang tải bảng điều khiển...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin">
      <Navbar />
      <div className="container">
        <h1>Bảng điều khiển</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">Danh mục</div>
            <h3>Tổng sản phẩm</h3>
            <p className="stat-number">{stats.totalProducts}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">Đơn hàng</div>
            <h3>Tổng đơn hàng</h3>
            <p className="stat-number">{stats.totalOrders}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">Doanh thu</div>
            <h3>Doanh thu</h3>
            <p className="stat-number">{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </div>

        <div className="admin-actions">
          <DashboardActionCard
            to="/admin/products"
            icon={<FaBoxArchive aria-hidden="true" />}
            title="Quản lý sản phẩm"
            description="Cập nhật giá bán, hình ảnh và danh mục hiển thị trên menu."
          />
          <DashboardActionCard
            to="/admin/orders"
            icon={<FaReceipt aria-hidden="true" />}
            title="Quản lý đơn hàng"
            description="Theo dõi đơn mới và cập nhật trạng thái xử lý theo quy trình."
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
