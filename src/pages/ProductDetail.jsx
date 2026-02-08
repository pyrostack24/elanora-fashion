import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import '../App.css';
import './pages.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { getProductById, isSizeAvailable } = useProducts();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [addedToCart, setAddedToCart] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="product-detail-page">
        <section className="container">
          <div className="not-found">
            <h1 className="heading-1">Product Not Found</h1>
            <p className="body-l">The product you're looking for doesn't exist.</p>
            <button onClick={() => navigate('/shop')} className="btn-primary">Back to Shop</button>
          </div>
        </section>
      </div>
    );
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleAddToCart = () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    if (!isSizeAvailable(product.id, selectedSize)) {
      alert('This size is currently out of stock');
      return;
    }
    addToCart({ ...product, size: selectedSize }, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
  };

  return (
    <div className="product-detail-page">
      <section className="product-detail-content">
        <div className="container">
          <button onClick={() => navigate(-1)} className="back-button body-m">
            ← Back
          </button>

          <div className="product-detail-layout">
            <div className="product-detail-image">
              <img src={product.image} alt={product.name} />
            </div>

            <div className="product-detail-info">
              <span className="product-category body-s">{product.category}</span>
              <h1 className="display-l">{product.name}</h1>
              <p className="product-price-large heading-1">{product.price}</p>
              
              <p className="product-description body-l">{product.description}</p>

              <div className="product-options">
                <div className="size-selector">
                  <div className="size-selector-header">
                    <label className="heading-3">Select Size</label>
                    <button className="size-chart-btn" onClick={() => setShowSizeChart(true)}>Size Chart</button>
                  </div>
                  <div className="size-buttons">
                    {sizes.map(size => {
                      const isAvailable = isSizeAvailable(product.id, size);
                      return (
                        <button
                          key={size}
                          onClick={() => isAvailable && setSelectedSize(size)}
                          className={`size-btn ${selectedSize === size ? 'active' : ''} ${!isAvailable ? 'disabled' : ''}`}
                          disabled={!isAvailable}
                          title={!isAvailable ? 'Out of stock' : ''}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="quantity-selector">
                  <label className="heading-3">Quantity</label>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-value body-l">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="product-actions">
                <button onClick={handleAddToCart} className="product-btn-primary">
                  {addedToCart ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" fill="currentColor"/>
                        <circle cx="20" cy="21" r="1" fill="currentColor"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
                <button onClick={() => navigate('/cart')} className="product-btn-secondary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                  </svg>
                  View Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showSizeChart && (
        <div className="modal-overlay" onClick={() => setShowSizeChart(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="heading-2">Size Chart</h2>
              <button className="modal-close" onClick={() => setShowSizeChart(false)}>×</button>
            </div>
            <div className="modal-body">
              <table className="size-chart-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Chest (inches)</th>
                    <th>Waist (inches)</th>
                    <th>Length (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>XS</td>
                    <td>34</td>
                    <td>28</td>
                    <td>27</td>
                  </tr>
                  <tr>
                    <td>S</td>
                    <td>36</td>
                    <td>30</td>
                    <td>28</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>38</td>
                    <td>32</td>
                    <td>29</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>40</td>
                    <td>34</td>
                    <td>30</td>
                  </tr>
                  <tr>
                    <td>XL</td>
                    <td>42</td>
                    <td>36</td>
                    <td>31</td>
                  </tr>
                  <tr>
                    <td>XXL</td>
                    <td>44</td>
                    <td>38</td>
                    <td>32</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
