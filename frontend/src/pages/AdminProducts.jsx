import { useState, useEffect } from 'react';
import api from '../utils/api';
import { ADMIN_PRODUCT_CATEGORIES, getCategoryLabel, normalizeCategoryKey } from '../constants/categories';
import { resolveImageUrl } from '../utils/images';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AdminProducts.css';

const initialForm = {
  name: '',
  description: '',
  price: '',
  category: 'pizza',
  image: '',
  ingredients: '',
  isAvailable: true,
};

const AdminProducts = () => {
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data.data?.products || []);
      setError('');
    } catch (requestError) {
      console.error('Error fetching products:', requestError);
      setError('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'image' && !selectedFile) {
      setImagePreview(value ? resolveImageUrl(value) : '');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);

    if (!file) {
      setImagePreview(formData.image ? resolveImageUrl(formData.image) : '');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result?.toString() || '');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = new FormData();
      payload.append('name', formData.name.trim());
      payload.append('description', formData.description.trim());
      payload.append('price', formData.price);
      payload.append('category', formData.category);
      payload.append('isAvailable', String(formData.isAvailable));
      payload.append('ingredients', formData.ingredients);

      if (selectedFile) {
        payload.append('image', selectedFile);
      } else if (formData.image.trim()) {
        payload.append('image', formData.image.trim());
      }

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }

      resetForm();
      fetchProducts();
      setError('');
    } catch (requestError) {
      console.error('Error saving product:', requestError);
      setError(requestError.response?.data?.message || 'Không thể lưu sản phẩm');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      // Khi mở dữ liệu cũ để chỉnh sửa, mình normalize về key mới để dropdown luôn hiển thị hợp lệ.
      category: normalizeCategoryKey(product.category),
      image: product.image || '',
      ingredients: Array.isArray(product.ingredients) ? product.ingredients.join(', ') : '',
      isAvailable: Boolean(product.isAvailable),
    });
    setImagePreview(product.image ? resolveImageUrl(product.image) : '');
    setSelectedFile(null);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (requestError) {
      console.error('Error deleting product:', requestError);
      setError(requestError.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setSelectedFile(null);
    setImagePreview('');
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="admin-products">
        <Navbar />
        <div className="admin-container">
          <div className="loading">Đang tải sản phẩm...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-products">
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <p className="section-kicker">Danh mục quản trị</p>
            <h1>Quản lý sản phẩm</h1>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)} type="button">
            + Thêm sản phẩm
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                <button className="close-btn" onClick={resetForm} type="button"></button>
              </div>
              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                  <label>Tên sản phẩm</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Ví dụ: Margherita Pizza"
                  />
                </div>

                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="Mô tả sản phẩm"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Giá (VND)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="129000"
                    />
                  </div>

                  <div className="form-group">
                    <label>Danh mục</label>
                    <select name="category" value={formData.category} onChange={handleInputChange}>
                      {ADMIN_PRODUCT_CATEGORIES.map((category) => (
                        <option key={category.key} value={category.key}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Tải ảnh lên</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>

                <div className="form-group">
                  <label>URL ảnh (tùy chọn)</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://... hoặc để trống nếu đã tải ảnh"
                  />
                </div>

                <div className="form-group">
                  <label>Thành phần</label>
                  <input
                    type="text"
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleInputChange}
                    placeholder="Mozzarella, basil, tomato"
                  />
                </div>

                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}

                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                    />
                    Có sẵn để bán
                  </label>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Xem trước</th>
                <th>Tên</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      className="table-thumbnail"
                      src={resolveImageUrl(product.image)}
                      alt={product.name}
                      onError={(event) => {
                        event.currentTarget.src = '/pizza-placeholder.svg';
                      }}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>
                    <span className="badge" title={product.category}>
                      {getCategoryLabel(product.category)}
                    </span>
                  </td>
                  <td>{Number(product.price).toLocaleString('vi-VN')}</td>
                  <td>
                    <span className={`status-badge ${product.isAvailable ? 'available' : 'unavailable'}`}>
                      {product.isAvailable ? 'Đang bán' : 'Tạm hết'}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(product)}
                      title="Chỉnh sửa"
                      type="button"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(product.id)}
                      title="Xóa"
                      type="button"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && !loading && (
          <div className="empty-state">
            <p>Chưa có sản phẩm nào</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminProducts;
