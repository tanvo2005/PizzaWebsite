import { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AdminProducts.css';

// Admin Products Management Page
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'meat',
    image: '',
    isAvailable: true
  });

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      const productsData = response.data.data?.products || [];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update product
        await api.put(`/products/${editingId}`, formData);
        setError('');
      } else {
        // Create product
        await api.post('/products', formData);
        setError('');
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      setError(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        setError(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'meat',
      image: '',
      isAvailable: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="admin-products">
        <Navbar />
        <div className="admin-container">
          <div className="loading">Loading products...</div>
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
          <h1>Product Management</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Product
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                <button className="close-btn" onClick={resetForm}>×</button>
              </div>
              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Margherita Pizza"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="Product description"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange}>
                      <option value="meat">Meat</option>
                      <option value="vegetarian">Vegetarian</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="/images/pizza.jpg"
                  />
                </div>

                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                    />
                    Available for Order
                  </label>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Update' : 'Create'} Product
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
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td><span className="badge">{product.category}</span></td>
                  <td>${parseFloat(product.price).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${product.isAvailable ? 'available' : 'unavailable'}`}>
                      {product.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(product)}
                      title="Edit"
                    >
                      ✎ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(product.id)}
                      title="Delete"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && !loading && (
          <div className="empty-state">
            <p>No products found. Create your first product!</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminProducts;