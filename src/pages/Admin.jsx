import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { supabase } from '../utils/supabase';
import '../App.css';
import './pages.css';
import './admin-card-recreated.css';

function Admin() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { products, updateProductPrice, updateProductStock } = useProducts();
  const [activeTab, setActiveTab] = useState('overview');
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingStock, setEditingStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState('all');

  const isAdmin = user?.email === 'admin@elanora.com' || 
                  user?.email === 'sadakaparamiwijerathna1@gmail.com' || 
                  user?.user_metadata?.role === 'admin';

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/signin');
      return;
    }
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [user, isAdmin, navigate, authLoading]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        const localUsers = JSON.parse(localStorage.getItem('elanora-users') || '[]');
        setRegisteredUsers(localUsers);
      } else {
        setRegisteredUsers(data.users || []);
      }
    } catch (error) {
      const localUsers = JSON.parse(localStorage.getItem('elanora-users') || '[]');
      setRegisteredUsers(localUsers);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceEdit = (product) => {
    setEditingProduct({
      id: product.id,
      price: product.price.replace('$', '')
    });
  };

  const handlePriceSave = () => {
    if (editingProduct) {
      updateProductPrice(editingProduct.id, `$${editingProduct.price}`);
      setEditingProduct(null);
    }
  };

  const handleStockEdit = (product) => {
    setEditingStock({
      id: product.id,
      name: product.name,
      stock: { ...product.stock }
    });
  };

  const handleStockSave = () => {
    if (editingStock) {
      Object.entries(editingStock.stock).forEach(([size, quantity]) => {
        updateProductStock(editingStock.id, size, quantity);
      });
      setEditingStock(null);
    }
  };

  const handleStockChange = (size, value) => {
    setEditingStock(prev => ({
      ...prev,
      stock: {
        ...prev.stock,
        [size]: parseInt(value) || 0
      }
    }));
  };

  const handleBulkStockUpdate = (action) => {
    if (!editingStock) return;
    
    const updatedStock = { ...editingStock.stock };
    Object.keys(updatedStock).forEach(size => {
      if (action === 'increase') {
        updatedStock[size] = updatedStock[size] + 10;
      } else if (action === 'decrease') {
        updatedStock[size] = Math.max(0, updatedStock[size] - 10);
      } else if (action === 'reset') {
        updatedStock[size] = 0;
      } else if (action === 'restock') {
        updatedStock[size] = 20;
      }
    });
    
    setEditingStock(prev => ({
      ...prev,
      stock: updatedStock
    }));
  };

  const getTotalStock = (product) => {
    return Object.values(product.stock).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalStockAllProducts = () => {
    return products.reduce((sum, p) => sum + getTotalStock(p), 0);
  };

  const getLowStockProducts = () => {
    return products.filter(p => getTotalStock(p) < 30 && getTotalStock(p) > 0);
  };

  const getOutOfStockProducts = () => {
    return products.filter(p => getTotalStock(p) === 0);
  };

  const getTotalValue = () => {
    return products.reduce((sum, p) => {
      const price = parseFloat(p.price.replace('$', ''));
      return sum + (price * getTotalStock(p));
    }, 0);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    const matchesStock = 
      stockFilter === 'all' ||
      (stockFilter === 'low' && getTotalStock(product) < 30 && getTotalStock(product) > 0) ||
      (stockFilter === 'out' && getTotalStock(product) === 0) ||
      (stockFilter === 'in' && getTotalStock(product) > 0);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const categories = ['All', ...new Set(products.map(p => p.category))];

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="admin-page">
      {/* Hero Section */}
      <section className="admin-hero-section">
        <div className="container">
          <div className="admin-hero-header">
            <div>
              <h1 className="display-l">Admin Dashboard</h1>
              <p className="body-l">Manage your Élanora Fashion inventory</p>
            </div>
            <div className="admin-user-info">
              <div className="admin-user-avatar">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="body-s">{user.user_metadata?.full_name || 'Admin'}</p>
                <p className="caption">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="admin-stats-section">
        <div className="container">
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="stat-card-icon products">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </div>
              <div className="stat-card-content">
                <p className="stat-label caption">Total Products</p>
                <h3 className="stat-value heading-1">{products.length}</h3>
                <p className="stat-change body-s">Active inventory</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-card-icon stock">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <div className="stat-card-content">
                <p className="stat-label caption">Total Stock</p>
                <h3 className="stat-value heading-1">{getTotalStockAllProducts()}</h3>
                <p className="stat-change body-s">Items in inventory</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-card-icon warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div className="stat-card-content">
                <p className="stat-label caption">Low Stock</p>
                <h3 className="stat-value heading-1">{getLowStockProducts().length}</h3>
                <p className="stat-change body-s">Need restocking</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-card-icon value">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                </svg>
              </div>
              <div className="stat-card-content">
                <p className="stat-label caption">Inventory Value</p>
                <h3 className="stat-value heading-1">${getTotalValue().toFixed(0)}</h3>
                <p className="stat-change body-s">Total worth</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-card-icon users">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <div className="stat-card-content">
                <p className="stat-label caption">Registered Users</p>
                <h3 className="stat-value heading-1">{registeredUsers.length}</h3>
                <p className="stat-change body-s">Total customers</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-card-icon error">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <div className="stat-card-content">
                <p className="stat-label caption">Out of Stock</p>
                <h3 className="stat-value heading-1">{getOutOfStockProducts().length}</h3>
                <p className="stat-change body-s">Unavailable items</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="admin-main-content">
        <div className="container">
          {/* Navigation Tabs */}
          <div className="admin-nav-tabs">
            <button
              className={`admin-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="9"/>
                <rect x="14" y="3" width="7" height="5"/>
                <rect x="14" y="12" width="7" height="9"/>
                <rect x="3" y="16" width="7" height="5"/>
              </svg>
              Overview
            </button>
            <button
              className={`admin-nav-tab ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
              Products
            </button>
            <button
              className={`admin-nav-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
              </svg>
              Users
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="admin-overview-content">
              <div className="admin-content-header">
                <h2 className="heading-2">Inventory Overview</h2>
                <p className="body-m">Quick insights into your store performance</p>
              </div>

              <div className="admin-overview-grid">
                {/* Low Stock Alert */}
                {getLowStockProducts().length > 0 && (
                  <div className="admin-alert-card warning">
                    <div className="alert-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                    </div>
                    <div className="alert-content">
                      <h3 className="heading-3">Low Stock Alert</h3>
                      <p className="body-s">{getLowStockProducts().length} products need restocking</p>
                      <ul className="alert-list">
                        {getLowStockProducts().slice(0, 3).map(p => (
                          <li key={p.id} className="body-s">
                            {p.name} - {getTotalStock(p)} items left
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Out of Stock Alert */}
                {getOutOfStockProducts().length > 0 && (
                  <div className="admin-alert-card error">
                    <div className="alert-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                    </div>
                    <div className="alert-content">
                      <h3 className="heading-3">Out of Stock</h3>
                      <p className="body-s">{getOutOfStockProducts().length} products are unavailable</p>
                      <ul className="alert-list">
                        {getOutOfStockProducts().slice(0, 3).map(p => (
                          <li key={p.id} className="body-s">{p.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="admin-products-content">
              <div className="admin-content-header">
                <div>
                  <h2 className="heading-2">Product Management</h2>
                  <p className="body-m">Manage prices and inventory</p>
                </div>
              </div>

              {/* Filters */}
              <div className="admin-filters">
                <div className="filter-search">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="filter-input"
                  />
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="filter-select"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Stock</option>
                  <option value="in">In Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>

              {/* Products Grid */}
              <div className="admin-products-grid">
                {filteredProducts.map(product => {
                  const totalStock = getTotalStock(product);
                  const isLowStock = totalStock > 0 && totalStock < 30;
                  const isOutOfStock = totalStock === 0;
                  
                  return (
                    <div key={product.id} className="admin-product-card-recreated">
                      {/* RECREATED PRODUCT CARD */}
                      {/* Card Image Section */}
                      <div className="card-image-section">
                        <img src={product.image} alt={product.name} className="card-product-image" />
                        
                        {/* Status Badge */}
                        {isOutOfStock && (
                          <div className="status-badge-overlay out-of-stock">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="15" y1="9" x2="9" y2="15"/>
                              <line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                            <span>Out of Stock</span>
                          </div>
                        )}
                        {!isOutOfStock && isLowStock && (
                          <div className="status-badge-overlay low-stock">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                              <line x1="12" y1="9" x2="12" y2="13"/>
                              <line x1="12" y1="17" x2="12.01" y2="17"/>
                            </svg>
                            <span>Low Stock</span>
                          </div>
                        )}
                        
                        {/* Quick Info Overlay */}
                        <div className="quick-info-overlay">
                          <div className="quick-info-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                            </svg>
                            <span className="info-label">Total Stock:</span>
                            <span className="info-value">{totalStock}</span>
                          </div>
                          <div className="quick-info-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                              <line x1="1" y1="10" x2="23" y2="10"/>
                            </svg>
                            <span className="info-label">ID:</span>
                            <span className="info-value">#{product.id}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Content Section */}
                      <div className="card-content-section">
                        {/* Product Header */}
                        <div className="product-header-recreated">
                          <div className="header-main">
                            <h3 className="product-name-recreated">{product.name}</h3>
                            <span className="product-category-recreated">{product.category}</span>
                          </div>
                        </div>

                        {/* Stock Sizes Grid */}
                        <div className="stock-sizes-grid">
                          {Object.entries(product.stock).map(([size, qty]) => (
                            <div key={size} className={`stock-size-card ${qty === 0 ? 'out' : qty < 5 ? 'low' : 'good'}`}>
                              <div className="size-name">{size}</div>
                              <div className="size-quantity">{qty}</div>
                              <div className="size-status">
                                {qty === 0 ? 'Empty' : qty < 5 ? 'Low' : 'Good'}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Price Section */}
                        <div className="price-section-recreated">
                          {editingProduct?.id === product.id ? (
                            <div className="price-edit-mode">
                              <div className="price-input-container">
                                <span className="currency-symbol">$</span>
                                <input
                                  type="number"
                                  value={editingProduct.price}
                                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                  className="price-input-field"
                                  step="0.01"
                                  autoFocus
                                  placeholder="0.00"
                                />
                              </div>
                              <div className="price-edit-actions">
                                <button onClick={handlePriceSave} className="btn-save-price" title="Save">
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12"/>
                                  </svg>
                                </button>
                                <button onClick={() => setEditingProduct(null)} className="btn-cancel-price" title="Cancel">
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="price-display-mode">
                              <div className="price-info-block">
                                <span className="price-label-text">PRICE</span>
                                <span className="price-amount-text">{product.price}</span>
                              </div>
                              <button onClick={() => handlePriceEdit(product)} className="btn-edit-price" title="Edit Price">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Manage Inventory Button */}
                        <button 
                          onClick={() => handleStockEdit(product)} 
                          className="btn-manage-inventory-recreated"
                          title="Manage product inventory"
                        >
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                            <line x1="12" y1="22.08" x2="12" y2="12"/>
                          </svg>
                          <span className="btn-text">Manage Inventory</span>
                        </button>
                      </div>
                    </div>
                  );

                })}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="admin-users-content">
              <div className="admin-content-header">
                <h2 className="heading-2">Registered Users</h2>
                <p className="body-m">View all platform users</p>
              </div>

              {loading ? (
                <div className="admin-loading">
                  <div className="loading-spinner"></div>
                  <p className="body-l">Loading users...</p>
                </div>
              ) : registeredUsers.length === 0 ? (
                <div className="admin-empty">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                  <p className="body-l">No users registered yet</p>
                </div>
              ) : (
                <div className="admin-users-table-wrapper">
                  <table className="admin-users-table">
                    <thead>
                      <tr>
                        <th className="body-m">User</th>
                        <th className="body-m">Email</th>
                        <th className="body-m">Registered</th>
                        <th className="body-m">Provider</th>
                        <th className="body-m">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registeredUsers.map((user, index) => (
                        <tr key={user.id || index}>
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar-sm">
                                {(user.user_metadata?.full_name || user.email)?.charAt(0).toUpperCase()}
                              </div>
                              <span className="body-s">{user.user_metadata?.full_name || user.name || 'User'}</span>
                            </div>
                          </td>
                          <td className="body-s">{user.email}</td>
                          <td className="body-s">
                            {user.created_at 
                              ? new Date(user.created_at).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })
                              : 'N/A'
                            }
                          </td>
                          <td>
                            <span className="provider-badge caption">
                              {user.app_metadata?.provider || user.provider || 'email'}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge caption ${user.email_confirmed_at || user.verified ? 'verified' : 'pending'}`}>
                              {user.email_confirmed_at || user.verified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Advanced Stock Editor Modal */}
      {editingStock && (
        <div className="admin-modal-overlay" onClick={() => setEditingStock(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="heading-2">Manage Stock</h2>
                <p className="body-m">{editingStock.name}</p>
              </div>
              <button onClick={() => setEditingStock(null)} className="modal-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              {/* Bulk Actions */}
              <div className="bulk-actions">
                <p className="body-s">Quick Actions:</p>
                <div className="bulk-action-buttons">
                  <button onClick={() => handleBulkStockUpdate('increase')} className="bulk-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    +10 All
                  </button>
                  <button onClick={() => handleBulkStockUpdate('decrease')} className="bulk-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    -10 All
                  </button>
                  <button onClick={() => handleBulkStockUpdate('restock')} className="bulk-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                    </svg>
                    Set 20 All
                  </button>
                  <button onClick={() => handleBulkStockUpdate('reset')} className="bulk-btn danger">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="1 4 1 10 7 10"/>
                      <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
                    </svg>
                    Reset All
                  </button>
                </div>
              </div>

              {/* Individual Size Controls */}
              <div className="stock-editor-grid">
                {Object.entries(editingStock.stock).map(([size, quantity]) => (
                  <div key={size} className="stock-editor-item">
                    <label className="body-m">{size}</label>
                    <div className="stock-control">
                      <button 
                        onClick={() => handleStockChange(size, Math.max(0, quantity - 1))}
                        className="stock-btn"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleStockChange(size, e.target.value)}
                        className="stock-input-modal"
                        min="0"
                      />
                      <button 
                        onClick={() => handleStockChange(size, quantity + 1)}
                        className="stock-btn"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                      </button>
                    </div>
                    <span className={`stock-status caption ${quantity === 0 ? 'out' : quantity < 10 ? 'low' : 'good'}`}>
                      {quantity === 0 ? 'Out' : quantity < 10 ? 'Low' : 'Good'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="stock-summary-modal">
                <div className="summary-item">
                  <span className="body-m">Total Stock:</span>
                  <span className="heading-3">{Object.values(editingStock.stock).reduce((a, b) => a + b, 0)}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setEditingStock(null)} className="btn-secondary-modal">Cancel</button>
              <button onClick={handleStockSave} className="btn-primary-modal">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
