import React, { useState } from 'react';
import '../App.css';
import './pages.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="contact-page">
      <section className="page-hero">
        <div className="container">
          <h1 className="display-l">Contact <span className="hero-accent">Us</span></h1>
          <p className="body-l">We'd love to hear from you</p>
        </div>
      </section>

      <section className="contact-content">
        <div className="container">
          <div className="contact-layout">
            <div className="contact-form-section">
              <h2 className="heading-2">Send Us a Message</h2>
              
              {submitted && (
                <div className="success-message">
                  <p className="body-m">Thank you! Your message has been sent.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name" className="body-m">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

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
                  <label htmlFor="subject" className="body-m">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="body-m">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="form-textarea"
                    rows="6"
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary">Send Message</button>
              </form>
            </div>

            <div className="contact-info-section">
              <h2 className="heading-2">Get In Touch</h2>
              <p className="body-m">Reach out through any of these channels</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
