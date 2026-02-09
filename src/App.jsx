import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { useWishlist } from './context/WishlistContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useProducts } from './context/ProductsContext';
import './tokens.css';
import './App.css';

// Import pages
import Shop from './pages/Shop';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetail from './pages/ProductDetail';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import GoogleCallback from './pages/GoogleCallback';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}

/* ========== HOME PAGE COMPONENT ========== */
function HomePage() {
  return (
    <>
      <Hero />
      <AboutFashion />
      <LatestTrends />
      <PromoBanner />
      <HotProducts />
      <LastChance />
    </>
  );
}

/* ========== HEADER COMPONENT ========== */
function Header() {
  const { getCartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-content">
          <Link to="/" className="header-brand">Élanora</Link>

          <nav className="header-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/shop" className="nav-link">Shop</Link>
            <Link to="/collection" className="nav-link">Collection</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>

          <div className="header-actions">
            <button className="icon-button" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button
              className="icon-button icon-button-badge"
              aria-label="Cart"
              onClick={() => navigate('/cart')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 2h2l1.6 9.6a2 2 0 002 1.6h9.8a2 2 0 002-1.6L20 6H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="8" cy="18" r="1" fill="currentColor" />
                <circle cx="16" cy="18" r="1" fill="currentColor" />
              </svg>
              {getCartCount() > 0 && (
                <span className="badge">{getCartCount()}</span>
              )}
            </button>
            {user ? (
              <button
                className="icon-button signin-button user-button"
                aria-label="Sign Out"
                onClick={signOut}
              >
                <span className="user-name">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : (
              <button
                className="icon-button signin-button"
                aria-label="Sign In"
                onClick={() => navigate('/signin')}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="10" cy="6" r="4" />
                  <path d="M3 18c0-3.866 3.134-7 7-7s7 3.134 7 7" strokeLinecap="round" />
                </svg>
                <span className="signin-text">Sign In</span>
              </button>
            )}
            <button
              className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
              aria-label="Menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <nav className="mobile-nav">
          <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/shop" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
          <Link to="/collection" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Collection</Link>
          <Link to="/about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link to="/contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          {user ? (
            <button
              className="nav-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
              onClick={() => {
                signOut();
                setIsMobileMenuOpen(false);
              }}
            >
              Sign Out ({user.user_metadata?.full_name || user.email?.split('@')[0]})
            </button>
          ) : (
            <Link to="/signin" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
          )}
        </nav>
      </div>

      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} navigate={navigate} />}
    </>
  );
}

/* ========== HERO COMPONENT ========== */
function Hero() {
  return (
    <section className="hero">
      <div className="hero-background">
        <img
          src="/hero.JPEG"
          alt="Fashion Background"
          className="hero-bg-image hero-bg-desktop"
        />
        <img
          src="/mobile-hero.JPEG"
          alt="Fashion Background Mobile"
          className="hero-bg-image hero-bg-mobile"
        />
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-scroll-indicator">
        <span className="scroll-text caption">Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}

/* ========== ABOUT FASHION COMPONENT ========== */
function AboutFashion() {
  const navigate = useNavigate();

  return (
    <section className="about-fashion">
      <div className="container">
        <div className="about-header">
          <h2 className="about-title">
            <span className="about-title-small heading-2">ABOUT</span>
            <span className="about-title-large display-l">FASHION</span>
          </h2>
        </div>

        <div className="about-content">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=700&fit=crop"
              alt="Fashion Portrait"
            />
          </div>

          <div className="about-text">
            <p className="about-intro">
              Élanora represents the pinnacle of contemporary fashion, where timeless elegance
              meets modern sophistication. Our curated collections are designed for those who
              appreciate the artistry of fine craftsmanship and the allure of distinctive style.
            </p>
            <p className="about-detail">
              Each piece in our collection tells a story of meticulous attention to detail,
              premium materials, and innovative design. We believe fashion is not just about
              clothing—it's about expressing your unique identity with confidence and grace.
            </p>
            <button className="btn-primary" onClick={() => navigate('/about')}>Learn More</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== LATEST TRENDS COMPONENT ========== */
function LatestTrends() {
  const categories = [
    { name: 'Shirts', count: 32 },
    { name: 'Outerwear', count: 24 },
    { name: 'Pants', count: 28 },
    { name: 'Shorts', count: 18 },
    { name: 'Accessories', count: 15 }
  ];

  return (
    <section className="latest-trends">
      <div className="container">
        <div className="trends-layout">
          <div className="trends-left">
            <span className="pill-label body-s">Explore Collection</span>
            <h2 className="trends-title heading-1">
              LATEST<br />TRENDS
            </h2>
            <p className="trends-description body-m">
              Discover the season's most coveted pieces, handpicked by our style curators
              to elevate your wardrobe with contemporary elegance.
            </p>
          </div>

          <div className="trends-image">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=700&fit=crop"
              alt="Fashion Model on Stool"
            />
          </div>

          <div className="trends-categories">
            <h3 className="heading-3">Explore The Range</h3>
            <div className="category-list">
              {categories.map((cat, index) => (
                <div key={index} className="category-item">
                  <span className="category-name body-s">{cat.name}</span>
                  <span className="category-count body-s">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== PROMO BANNER COMPONENT ========== */
function PromoBanner() {
  const navigate = useNavigate();

  return (
    <section className="promo-banner">
      <div className="promo-overlay"></div>
      <div className="promo-content-wrapper">
        <h2 className="promo-heading display-l">New Season Arrivals</h2>
        <p className="promo-subtext body-l">Curated styles for the modern wardrobe</p>
        <button className="promo-button btn-primary" onClick={() => navigate('/shop')}>Shop Now</button>
      </div>
    </section>
  );
}

/* ========== HOT PRODUCTS COMPONENT ========== */
function HotProducts() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { products } = useProducts();

  // Show first 4 products
  const featuredProducts = products.slice(0, 4);

  return (
    <section className="hot-products">
      <div className="container">
        <div className="products-header">
          <div className="products-header-left">
            <span className="pill-label body-s">Trending Now</span>
            <h2 className="products-title heading-1">Featured Collection</h2>
            <p className="products-subtitle body-m">Handpicked pieces that define this season's style</p>
          </div>
          <button className="btn-view-all" onClick={() => navigate('/shop')}>View All Products</button>
        </div>

        <div className="products-grid-new">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card-new">
              <div className="product-image-container" onClick={() => navigate(`/product/${product.id}`)}>
                <img src={product.image} alt={product.name} className="product-image-new" />
                <div className="product-overlay">
                  <button className="btn-quick-view">Quick View</button>
                </div>
                <span className="product-category-badge caption">{product.category}</span>
              </div>
              <div className="product-details">
                <h3 className="product-name-new body-l">{product.name}</h3>
                <div className="product-footer">
                  <span className="product-price-new heading-3">{product.price}</span>
                  <button
                    className="btn-add-cart"
                    aria-label="Add to cart"
                    onClick={() => addToCart(product)}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2 2h2l1.6 9.6a2 2 0 002 1.6h9.8a2 2 0 002-1.6L20 6H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="8" cy="18" r="1" fill="currentColor" />
                      <circle cx="16" cy="18" r="1" fill="currentColor" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== LAST CHANCE COMPONENT ========== */
function LastChance() {
  const [timeLeft] = useState({ days: 2, hours: 14, mins: 32, secs: 18 });
  const navigate = useNavigate();

  return (
    <section className="last-chance">
      <div className="container">
        <div className="last-chance-card">
          <div className="last-chance-content">
            <h2 className="heading-1">LAST CHANCE TO OWN IT</h2>
            <p className="body-m">
              Final opportunity to acquire this season's most sought-after pieces.
              Limited quantities available—once they're gone, they're gone forever.
            </p>
            <button className="btn-primary" onClick={() => navigate('/shop')}>Shop Now</button>
          </div>

          <div className="last-chance-image">
            <img
              src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=700&fit=crop"
              alt="Limited Edition Jacket"
            />
          </div>

          <div className="countdown-timer">
            <div className="timer-digit">
              <span className="digit-value">{timeLeft.days}</span>
              <span className="digit-label caption">Days</span>
            </div>
            <div className="timer-digit">
              <span className="digit-value">{timeLeft.hours}</span>
              <span className="digit-label caption">Hours</span>
            </div>
            <div className="timer-digit">
              <span className="digit-value">{timeLeft.mins}</span>
              <span className="digit-label caption">Mins</span>
            </div>
            <div className="timer-digit">
              <span className="digit-value">{timeLeft.secs}</span>
              <span className="digit-label caption">Secs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== TESTIMONIALS COMPONENT ========== */
function Testimonials() {
  const testimonials = [
    {
      name: 'Michael Chen',
      rating: 5,
      text: 'Exceptional quality and timeless style. Every piece I\'ve purchased has become a staple in my wardrobe.',
      role: 'Creative Director'
    },
    {
      name: 'James Rodriguez',
      rating: 5,
      text: 'The attention to detail is remarkable. Élanora has redefined my understanding of premium menswear.',
      role: 'Entrepreneur'
    },
    {
      name: 'David Park',
      rating: 5,
      text: 'Finally found a brand that combines sophistication with comfort. The fit is absolutely perfect.',
      role: 'Architect'
    }
  ];

  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <span className="pill-label body-s">Customer Reviews</span>
          <h2 className="heading-1">What Our Clients Say</h2>
          <p className="body-m testimonials-subtitle">Trusted by discerning gentlemen worldwide</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 1l2.5 6.5L19 8l-5 4.5L15.5 19 10 15.5 4.5 19 6 12.5 1 8l6.5-.5L10 1z" />
                  </svg>
                ))}
              </div>
              <p className="testimonial-text body-l">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <p className="author-name body-m">{testimonial.name}</p>
                <p className="author-role caption">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== STYLE GUIDE COMPONENT ========== */
function StyleGuide() {
  const navigate = useNavigate();

  const styles = [
    {
      title: 'Business Casual',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop',
      tag: 'Professional'
    },
    {
      title: 'Weekend Comfort',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop',
      tag: 'Casual'
    },
    {
      title: 'Evening Elegance',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
      tag: 'Formal'
    },
    {
      title: 'Urban Explorer',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop',
      tag: 'Street'
    }
  ];

  return (
    <section className="style-guide">
      <div className="container">
        <div className="style-guide-header">
          <span className="pill-label body-s">Style Inspiration</span>
          <h2 className="heading-1">Curated Looks</h2>
          <p className="body-m style-guide-subtitle">Discover your signature style</p>
        </div>

        <div className="style-guide-grid">
          {styles.map((style, index) => (
            <div key={index} className="style-card" onClick={() => navigate('/shop')}>
              <div className="style-image-wrapper">
                <img src={style.image} alt={style.title} className="style-image" />
                <div className="style-overlay">
                  <button className="btn-shop-look">Shop This Look</button>
                </div>
              </div>
              <div className="style-info">
                <span className="style-tag caption">{style.tag}</span>
                <h3 className="style-title body-l">{style.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== INSTAGRAM FEED COMPONENT ========== */
function InstagramFeed() {
  const instagramPosts = [
    'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=400&h=400&fit=crop'
  ];

  return (
    <section className="instagram-feed">
      <div className="container">
        <div className="instagram-header">
          <h2 className="heading-2">Follow Our Journey</h2>
          <p className="body-m instagram-subtitle">@elanora_fashion</p>
          <a href="#instagram" className="instagram-follow-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="18" cy="6" r="1.5" fill="currentColor" />
            </svg>
            Follow Us
          </a>
        </div>

        <div className="instagram-grid">
          {instagramPosts.map((post, index) => (
            <div key={index} className="instagram-post">
              <img src={post} alt={`Instagram post ${index + 1}`} />
              <div className="instagram-overlay">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== FOOTER COMPONENT ========== */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          <div className="footer-brand-section">
            <h2 className="footer-logo heading-2">Élanora</h2>
            <p className="footer-tagline body-m">Premium Men's Fashion for the Modern Gentleman</p>
          </div>

          <div className="footer-newsletter">
            <h3 className="heading-3">Stay Updated</h3>
            <p className="body-s">Subscribe to our newsletter for exclusive offers</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" className="newsletter-input" />
              <button className="newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="footer-middle">
          <div className="footer-column">
            <h4 className="footer-column-title body-l">Shop</h4>
            <ul className="footer-links">
              <li><Link to="/shop" className="body-s">Shirts</Link></li>
              <li><Link to="/shop" className="body-s">Outerwear</Link></li>
              <li><Link to="/shop" className="body-s">Pants & Shorts</Link></li>
              <li><Link to="/shop" className="body-s">Accessories</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-column-title body-l">Company</h4>
            <ul className="footer-links">
              <li><Link to="/about" className="body-s">About Us</Link></li>
              <li><a href="#careers" className="body-s">Careers</a></li>
              <li><a href="#stores" className="body-s">Store Locator</a></li>
              <li><a href="#sustainability" className="body-s">Sustainability</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-column-title body-l">Help</h4>
            <ul className="footer-links">
              <li><Link to="/contact" className="body-s">Contact Us</Link></li>
              <li><a href="#shipping" className="body-s">Shipping Info</a></li>
              <li><a href="#returns" className="body-s">Returns</a></li>
              <li><a href="#faq" className="body-s">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-column-title body-l">Follow Us</h4>
            <div className="footer-social">
              <a href="#instagram" className="social-link" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                  <circle cx="18" cy="6" r="1.5" fill="currentColor" />
                </svg>
              </a>
              <a href="#facebook" className="social-link" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="#twitter" className="social-link" aria-label="Twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="#pinterest" className="social-link" aria-label="Pinterest">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.7-1.05 3.15-2.54 3.74-.19-.83-.36-2.1.08-3.01.39-.81 1.28-2.73 1.28-2.73s-.33-.66-.33-1.63c0-1.53.89-2.67 1.99-2.67.94 0 1.39.7 1.39 1.55 0 .94-.6 2.35-.91 3.66-.26 1.09.55 1.98 1.62 1.98 1.95 0 3.45-2.05 3.45-5.01 0-2.62-1.88-4.45-4.57-4.45-3.11 0-4.94 2.33-4.94 4.74 0 .94.36 1.94.81 2.49.09.1.1.19.07.3l-.3 1.24c-.05.18-.16.22-.37.13-1.37-.64-2.23-2.64-2.23-4.25 0-3.46 2.51-6.63 7.24-6.63 3.8 0 6.76 2.71 6.76 6.33 0 3.78-2.38 6.82-5.68 6.82-1.11 0-2.15-.58-2.51-1.26l-.68 2.6c-.25.95-.92 2.15-1.37 2.88A10 10 0 0112 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z" stroke="currentColor" strokeWidth="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p className="caption">© 2025 Élanora. All Rights Reserved.</p>
          </div>
          <div className="footer-bottom-right">
            <a href="#privacy" className="caption">Privacy Policy</a>
            <span className="caption">•</span>
            <a href="#terms" className="caption">Terms of Service</a>
            <span className="caption">•</span>
            <a href="#cookies" className="caption">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ========== SEARCH MODAL COMPONENT ========== */
function SearchModal({ onClose, navigate }) {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  // Handle product click
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    onClose();
  };

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-header">
          <input
            type="text"
            className="search-input"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
          />
          <button className="search-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="search-results">
          {searchQuery && searchResults.length === 0 && (
            <div className="search-no-results">
              <p>No products found for "{searchQuery}"</p>
            </div>
          )}
          {searchResults.length > 0 && (
            <div className="search-results-list">
              {searchResults.map(product => (
                <div
                  key={product.id}
                  className="search-result-item"
                  onClick={() => handleProductClick(product.id)}
                >
                  <img src={product.image} alt={product.name} className="search-result-image" />
                  <div className="search-result-info">
                    <h4>{product.name}</h4>
                    <p className="search-result-category">{product.category}</p>
                    <p className="search-result-price">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
