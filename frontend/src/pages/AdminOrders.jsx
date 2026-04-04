import { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AdminOrders.css';

// Admin Orders Management Page
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      const ordersData = response.data.data?.orders || [];
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      setError(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'preparing':
        return 'status-preparing';
      case 'delivering':
        return 'status-delivering';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
          <h1>Order Management</h1>
          <button className="btn btn-secondary" onClick={fetchOrders}>
            🔄 Refresh
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        {showDetails && selectedOrder && (
          <div className="modal-overlay">
            <div className="modal modal-lg">
              <div className="modal-header">
                <h2>Order Details #{selectedOrder.id}</h2>
                <button className="close-btn" onClick={() => setShowDetails(false)}>×</button>
              </div>
              <div className="order-details">
                <div className="details-section">
                  <h3>Customer Information</h3>
                  <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Email:</strong> {selectedOrder.User?.email}</p>
                  <p><strong>Phone:</strong> {selectedOrder.phoneNumber}</p>
                  <p><strong>Address:</strong> {selectedOrder.deliveryAddress}</p>
                </div>

                <div className="details-section">
                  <h3>Order Items</h3>
                  {selectedOrder.OrderItems && selectedOrder.OrderItems.length > 0 ? (
                    <ul className="items-list">
                      {selectedOrder.OrderItems.map((item) => (
                        <li key={item.id}>
                          <strong>{item.Product?.name}</strong>
                          <span>x{item.quantity}</span>
                          <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No items</p>
                  )}
                </div>

                <div className="details-section">
                  <h3>Order Summary</h3>
                  <p><strong>Status:</strong> <span className={`badge ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                  <p><strong>Total Amount:</strong> ${parseFloat(selectedOrder.totalAmount).toFixed(2)}</p>
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
                  <td>${parseFloat(order.totalAmount).toFixed(2)}</td>
                  <td>
                    <select
                      className={`status-select ${getStatusColor(order.status)}`}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="delivering">Delivering</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td className="actions">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleViewDetails(order)}
                    >
                      👁 View Details
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