import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import '../App.css';
import './pages.css';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? (subtotal > 500 ? 0 : 25) : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <section className="page-hero">
          <div className="container">
            <h1 className="display-l">Shopping <span className="hero-accent">Cart</span></h1>
            <p className="body-l">Your cart is empty</p>
          </div>
        </section>

        <section className="empty-cart">
          <div className="container">
            <div className="empty-cart-content">
              <h2 className="heading-2">Your cart is empty</h2>
              <p className="body-l">Add some items to get started</p>
              <Link to="/shop" className="btn-primary">Continue Shopping</Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="display-l">Shopping <span className="hero-accent">Cart</span></h1>
          <p className="body-l">{cartItems.length} items in your cart</p>
        </div>
      </section>

      <section className="cart-content">
        <div className="container">
          <div className="cart-layout">
            <div className="cart-items">
              <div className="cart-header">
                <h2 className="heading-2">Cart Items</h2>
                <button onClick={clearCart} className="btn-text">Clear Cart</button>
              </div>

              {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.size}-${index}`} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h3 className="heading-3">{item.name}</h3>
                    <p className="body-s">{item.category}</p>
                    {item.size && <p className="body-s">Size: <strong>{item.size}</strong></p>}
                    <p className="cart-item-price heading-3">{item.price}</p>
                  </div>
                  <div className="cart-item-quantity">
                    <button 
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-value body-m">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-total">
                    <p className="heading-2">${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="cart-item-remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2 className="heading-2">Order Summary</h2>
              
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

              <Link to="/checkout" className="btn-primary btn-full">Proceed to Checkout</Link>
              <Link to="/shop" className="btn-secondary btn-full">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Cart;
