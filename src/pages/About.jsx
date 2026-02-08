import React from 'react';
import '../App.css';
import './pages.css';

function About() {
  return (
    <div className="about-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="display-l">About <span className="hero-accent">Élanora</span></h1>
          <p className="body-l">Where Timeless Fashion Meets Modern Elegance</p>
        </div>
      </section>

      <section className="about-story">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <span className="pill-label body-s">Our Story</span>
              <h2 className="heading-1">Crafting Excellence Since 2020</h2>
              <p className="body-l">
                Élanora was born from a passion for creating fashion that transcends trends.
              </p>
            </div>
            <div className="story-image">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&h=800&fit=crop" 
                alt="Fashion Store" 
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
