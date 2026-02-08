import React from 'react';
import '../App.css';

function NewArrivals() {
  const newProducts = [
    {
      id: 1,
      name: 'Premium Polo',
      price: '$549',
      category: 'Shirts',
      image: '/Featured/men-polo.png',
      badge: 'New'
    },
    {
      id: 2,
      name: 'Tech Hoodie',
      price: '$799',
      category: 'Outerwear',
      image: '/Featured/men-hoodie.png',
      badge: 'New'
    },
    {
      id: 3,
      name: 'Sport Short',
      price: '$649',
      category: 'Pants',
      image: '/Featured/men-short.png',
      badge: 'New'
    },
    {
      id: 4,
      name: 'Oxford Shirt',
      price: '$429',
      category: 'Shirts',
      image: '/Featured/men-shirt.png',
      badge: 'New'
    },
    {
      id: 5,
      name: 'Casual Polo',
      price: '$499',
      category: 'Shirts',
      image: '/Featured/men-polo.png',
      badge: 'New'
    },
    {
      id: 6,
      name: 'Zip Hoodie',
      price: '$729',
      category: 'Outerwear',
      image: '/Featured/men-hoodie.png',
      badge: 'New'
    }
  ];

  return (
    <div className="new-arrivals-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="display-l">New Arrivals</h1>
          <p className="body-l">Be the first to discover our latest pieces</p>
        </div>
      </section>

      <section className="new-arrivals-content">
        <div className="container">
          <div className="products-grid-new">
            {newProducts.map(product => (
              <div key={product.id} className="product-card-new">
                <div className="product-image-container">
                  <img src={product.image} alt={product.name} className="product-image-new" />
                  <div className="product-overlay">
                    <button className="btn-quick-view">Quick View</button>
                  </div>
                  <span className="product-badge-new">{product.badge}</span>
                  <span className="product-category-badge caption">{product.category}</span>
                </div>
                <div className="product-info-new">
                  <h3 className="product-name-new heading-3">{product.name}</h3>
                  <p className="product-price-new heading-2">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default NewArrivals;
