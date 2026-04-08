import { useState, useEffect } from "react";
import api from "../utils/api";
import { formatCurrency } from "../utils/format";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./AdminOrders.css";

const statusLabels = {
  pending: "Đang chờ",
  confirmed: "Đã xác nhận",
  preparing: "Đang chuẩn bị",
  ready: "Sẵn sàng",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const AdminOrders = () => {
  // Việt hóa toàn bộ text hiển thị nhưng giữ nguyên cấu trúc và logic sẵn có.
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders");
      setOrders(response.data.data?.orders || []);
      setError("");
    } catch (requestError) {
      console.error("Error fetching orders:", requestError);
      setError("Không thể tải đơn hàng !");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (requestError) {
      console.error("Error updating status:", requestError);
      setError(
        requestError.response?.data?.message || "Không thể cập nhật trạng thái",
      );
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const getStatusColor = (status) => `status-${status}`;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="admin-orders">
        <Navbar />
        <div className="admin-container">
          <div className="loading">Đang tải đơn hàng....</div>
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
            <p className="section-kicker">Quản lý bếp</p>
            <h1>Quản lý đơn hàng</h1>
          </div>
          <button
            className="btn btn-secondary"
            onClick={fetchOrders}
            type="button"
          >
            Làm mới
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        {showDetails && selectedOrder && (
          <div className="modal-overlay">
            <div className="modal modal-lg">
              <div className="modal-header">
                <h2>Chi tiết đơn hàng #{selectedOrder.id}</h2>
                <button className="close-btn" onClick={() => setShowDetails(false)} type="button">X</button>
              </div>
              <div className="order-details">
                <div className="details-section">
                  <h3>Thông tin khách hàng</h3>
                  <p>
                    <strong>Tên:</strong> {selectedOrder.customerName}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {selectedOrder.user?.email || "Không có"}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {selectedOrder.phoneNumber}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {selectedOrder.deliveryAddress}
                  </p>
                </div>

                <div className="details-section">
                  <h3>Danh sách món</h3>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    <ul className="items-list">
                      {selectedOrder.items.map((item) => (
                        <li key={item.id}>
                          <strong>
                            {item.productName || item.product?.name}
                          </strong>
                          <span>x{item.quantity}</span>
                          <span>{formatCurrency(item.totalPrice)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Chưa có món nào cả</p>
                  )}
                </div>

                <div className="details-section">
                  <h3>Tóm tắt đơn</h3>
                  <p>
                    <strong>Trạng thái:</strong>
                    <span
                      className={`badge ${getStatusColor(selectedOrder.status)}`}
                    >
                      {statusLabels[selectedOrder.status]}
                    </span>
                  </p>
                  <p>
                    <strong>Tổng tiền:</strong>{" "}
                    {formatCurrency(selectedOrder.totalAmount)}
                  </p>
                  <p>
                    <strong>Phương thức thanh toán:</strong>{" "}
                    {selectedOrder.paymentMethod}
                  </p>
                  <p>
                    <strong>Ghi chú:</strong>{" "}
                    {selectedOrder.specialInstructions || "Không có"}
                  </p>
                  <p>
                    <strong>Thời gian đặt:</strong>{" "}
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
                <th>Thao tác</th>
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
                      onChange={(event) =>
                        handleStatusChange(order.id, event.target.value)
                      }
                    >
                      {Object.entries(statusLabels).map(([status, label]) => (
                        <option key={status} value={status}>
                          {label}
                        </option>
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
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && !loading && (
          <div className="empty-state">
            <p>Chưa có đơn hàng nào</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminOrders;
