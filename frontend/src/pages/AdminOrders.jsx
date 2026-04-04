import { useState, useEffect } from 'react';
import api from '../utils/api';
import { formatCurrency } from '../utils/format';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AdminOrders.css';

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data.data?.orders || []);
      setError('');
    } catch (requestError) {
      console.error('Error fetching orders:', requestError);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (requestError) {
      console.error('Error updating status:', requestError);
      setError(requestError.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const getStatusColor = (status) => `status-${status}`;

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (loading) {
    return (
      <div className="admin-orders">
        <Navbar />
        <div className="admin-container">
          <div className="loading">Loading orders...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <p className="section-kicker">Kitchen flow</p>
            <h1>Order Management</h1>
          </div>
          <button className="btn btn-secondary" onClick={fetchOrders} type="button">
            Refresh
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        {showDetails && selectedOrder && (
          <div className="modal-overlay">
            <div className="modal modal-lg">
              <div className="modal-header">
                <h2>Order Details #{selectedOrder.id}</h2>
                <button className="close-btn" onClick={() => setShowDetails(false)} type="button">×</button>
              </div>
              <div className="order-details">
                <div className="details-section">
                  <h3>Customer Information</h3>
                  <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {selectedOrder.phoneNumber}</p>
                  <p><strong>Address:</strong> {selectedOrder.deliveryAddress}</p>
                </div>

                <div className="details-section">
                  <h3>Order Items</h3>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    <ul className="items-list">
                      {selectedOrder.items.map((item) => (
                        <li key={item.id}>
                          <strong>{item.productName || item.product?.name}</strong>
                          <span>x{item.quantity}</span>
                          <span>{formatCurrency(item.totalPrice)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No items</p>
                  )}
                </div>

                <div className="details-section">
                  <h3>Order Summary</h3>
                  <p><strong>Status:</strong> <span className={`badge ${getStatusColor(selectedOrder.status)}`}>{statusLabels[selectedOrder.status]}</span></p>
                  <p><strong>Total Amount:</strong> {formatCurrency(selectedOrder.totalAmount)}</p>
                  <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                  <p><strong>Special Instructions:</strong> {selectedOrder.specialInstructions || 'None'}</p>
                  <p><strong>Ordered at:</strong> {formatDate(selectedOrder.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>{formatCurrency(order.totalAmount)}</td>
                  <td>
                    <select
                      className={`status-select ${getStatusColor(order.status)}`}
                      value={order.status}
                      onChange={(event) => handleStatusChange(order.id, event.target.value)}
                    >
                      {Object.entries(statusLabels).map(([status, label]) => (
                        <option key={status} value={status}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td className="actions">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleViewDetails(order)}
                      type="button"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && !loading && (
          <div className="empty-state">
            <p>No orders found</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminOrders;
