import { useState, useEffect } from 'react';
import api from '../utils/api';
import { resolveImageUrl } from '../utils/images';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AdminProducts.css';

const initialForm = {
  name: '',
  description: '',
  price: '',
  category: 'meat',
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
      setError('Failed to load products');
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
      setError(requestError.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
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
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (requestError) {
      console.error('Error deleting product:', requestError);
      setError(requestError.response?.data?.message || 'Failed to delete product');
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
          <div>
            <p className="section-kicker">Admin catalog</p>
            <h1>Product Management</h1>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)} type="button">
            + Add Product
          </button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                <button className="close-btn" onClick={resetForm} type="button">×</button>
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
                    <label>Price (VND)</label>
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
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange}>
                      <option value="meat">Meat</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="special">Special</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Upload image</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>

                <div className="form-group">
                  <label>Image URL (optional)</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://... or keep empty when uploading file"
                  />
                </div>

                <div className="form-group">
                  <label>Ingredients</label>
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
                <th>Preview</th>
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
                  <td><span className="badge">{product.category}</span></td>
                  <td>{Number(product.price).toLocaleString('vi-VN')} đ</td>
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
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(product.id)}
                      title="Delete"
                      type="button"
                    >
                      Delete
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
