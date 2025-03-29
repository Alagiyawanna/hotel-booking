import React, { useState } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import './contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Form is valid, simulate submission
      setIsSubmitting(true);
      
      // Simulate API call with timeout
      setTimeout(() => {
        console.log('Form data submitted:', formData);
        setSubmitted(true);
        setIsSubmitting(false);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      }, 1500);
    }
  };

  return (
    <div className="contact-page">
      <Navbar />
      
      <div className="contact-hero">
        <div>
          <h1>Contact Us</h1>
          <p>We're here to help with any questions about your booking or our services</p>
        </div>
      </div>
      
      <div className="contact-container">
        <div className="contact-grid">
          <div className="contact-form-container">
            {submitted ? (
              <div className="success-message">
                <h2>Thank you for contacting us!</h2>
                <p>We've received your message and will respond shortly.</p>
                <button 
                  className="new-message-button"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="contact-form-header">
                  <h2>Get in Touch</h2>
                  <p>Fill out the form below and our team will get back to you as soon as possible.</p>
                </div>
                
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? 'input-error' : ''}
                      placeholder="John Doe"
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'input-error' : ''}
                      placeholder="john@example.com"
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={errors.subject ? 'input-error' : ''}
                      placeholder="Booking Inquiry"
                    />
                    {errors.subject && <span className="error-text">{errors.subject}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className={errors.message ? 'input-error' : ''}
                      placeholder="How can we help you today?"
                    ></textarea>
                    {errors.message && <span className="error-text">{errors.message}</span>}
                  </div>
                  
                  <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
          
          <div className="contact-info">
            <div className="contact-info-header">
              <h3>Contact Information</h3>
              <p>Reach out to us through any of these channels</p>
            </div>
            
            <div className="contact-methods">
              <div className="contact-method">
                <div className="contact-method-icon">
                  ✉️
                </div>
                <div className="contact-method-details">
                  <h4>Email Us</h4>
                  <p>support@staysphere.com</p>
                  <p>bookings@staysphere.com</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-method-icon">
                  📞
                </div>
                <div className="contact-method-details">
                  <h4>Call Us</h4>
                  <p>+1 (555) 123-4567</p>
                  <p>Mon-Fri: 9am - 6pm</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-method-icon">
                  📍
                </div>
                <div className="contact-method-details">
                  <h4>Visit Us</h4>
                  <p>123 Hotel Street</p>
                  <p>Booking City, 12345</p>
                </div>
              </div>
            </div>
            
            <div className="social-links">
              <a href="#" className="social-link">
                𝕏
              </a>
              <a href="#" className="social-link">
                𝕗
              </a>
              <a href="#" className="social-link">
                𝕚
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;