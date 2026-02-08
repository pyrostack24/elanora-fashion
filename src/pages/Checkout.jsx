import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './pages.css';

function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Order submitted:', formData);
    setOrderPlaced(true);
    clearCart();
    
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 25;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <section className="order-success">
          <div className="container">
            <div className="success-content">
              <div className="success-icon">✓</div>
              <h1 className="display-l">Order Placed Successfully!</h1>
              <p className="body-l">Thank you for your purchase</p>
              <p className="body-m">Order Total: ${total.toFixed(2)}</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="display-l">Checkout</h1>
          <p className="body-l">Complete your purchase</p>
        </div>
      </section>

      <section className="checkout-content">
        <div className="container">
          <div className="checkout-layout">
            <div className="checkout-form-section">
              <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-section">
                  <h2 className="heading-2">Shipping Information</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName" className="body-m">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName" className="body-m">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email" className="body-m">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone" className="body-m">Phone *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="address" className="body-m">Address *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city" className="body-m">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="state" className="body-m">State *</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="zipCode" className="body-m">ZIP *</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary btn-full">Place Order - ${total.toFixed(2)}</button>
              </form>
            </div>

            <div className="checkout-summary">
              <h2 className="heading-2">Order Summary</h2>
              
              <div className="checkout-items">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${index}`} className="checkout-item">
                    <img src={item.image} alt={item.name} />
                    <div className="checkout-item-info">
                      <p className="body-m">{item.name}</p>
                      {item.size && <p className="body-s">Size: {item.size}</p>}
                      <p className="body-s">Qty: {item.quantity}</p>
                    </div>
                    <p className="body-m">${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row">
                <span className="body-m">Subtotal</span>
                <span className="body-m">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span className="body-m">Shipping</span>
                <span className="body-m">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              
              <div className="summary-row">
                <span className="body-m">Tax (8%)</span>
                <span className="body-m">${tax.toFixed(2)}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row summary-total">
                <span className="heading-3">Total</span>
                <span className="heading-2">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Checkout;
