import React from 'react';
import '../App.css';

function Collection() {
  const collections = [
    {
      id: 1,
      title: 'Spring Collection',
      description: 'Fresh styles for the new season',
      image: '/Featured/men-polo.png',
      items: 24
    },
    {
      id: 2,
      title: 'Urban Essentials',
      description: 'Contemporary streetwear basics',
      image: '/Featured/men-hoodie.png',
      items: 18
    },
    {
      id: 3,
      title: 'Summer Vibes',
      description: 'Light and comfortable pieces',
      image: '/Featured/men-short.png',
      items: 32
    },
    {
      id: 4,
      title: 'Classic Formal',
      description: 'Timeless elegance for every occasion',
      image: '/Featured/men-shirt.png',
      items: 15
    }
  ];

  return (
    <div className="collection-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="display-l">Our <span className="hero-accent">Collections</span></h1>
          <p className="body-l">Curated selections that define contemporary style</p>
        </div>
      </section>

      <section className="collections-content">
        <div className="container">
          <div className="collections-grid">
            {collections.map(collection => (
              <div key={collection.id} className="collection-card">
                <div className="collection-image">
                  <img src={collection.image} alt={collection.title} />
                  <div className="collection-overlay">
                    <button className="btn-primary">Explore Collection</button>
                  </div>
                </div>
                <div className="collection-info">
                  <h3 className="heading-2">{collection.title}</h3>
                  <p className="body-m">{collection.description}</p>
                  <span className="body-s">{collection.items} Items</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Collection;
