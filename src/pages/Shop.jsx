import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import '../App.css';
import './pages.css';

function Shop() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { products, isProductInStock } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Shirts', 'Outerwear', 'Pants', 'Accessories'];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="shop-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="display-l">Shop <span className="hero-accent">Collection</span></h1>
          <p className="body-l">Discover our complete range of premium fashion</p>
        </div>
      </section>

      <section className="shop-content">
        <div className="container">
          <div className="shop-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="shop-products-grid">
            {filteredProducts.map(product => {
              const inStock = isProductInStock(product.id);
              return (
                <div key={product.id} className="shop-product-card">
                  <div className="shop-card-image-wrapper">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="shop-card-image"
                      onClick={() => navigate(`/product/${product.id}`)}
                    />
                    
                    {!inStock && (
                      <div className="shop-out-of-stock-overlay">
                        <span className="out-of-stock-text">OUT OF STOCK</span>
                      </div>
                    )}
                    
                    <button 
                      className={`shop-wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      aria-label="Add to wishlist"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill={isInWishlist(product.id) ? "currentColor" : "none"}>
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    <div className="shop-card-badge">{product.category}</div>
                  </div>

                <div className="shop-card-content">
                  <div className="shop-card-header">
                    <h3 className="shop-card-title" onClick={() => navigate(`/product/${product.id}`)}>
                      {product.name}
                    </h3>
                    <div className="shop-card-rating">
                      <span className="rating-stars">★</span>
                      <span className="rating-value">{product.rating}</span>
                      <span className="rating-count">({product.reviews})</span>
                    </div>
                  </div>

                  <div className="shop-card-footer">
                    <div className="shop-card-price-section">
                      <span className="shop-card-price">{product.price}</span>
                    </div>
                    <button 
                      className="shop-add-to-cart-btn"
                      onClick={() => navigate(`/product/${product.id}`)}
                      aria-label="View details"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                      </svg>
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Shop;
