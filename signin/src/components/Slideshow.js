import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Slideshow.css';

const Slideshow = ({ items, title, subtitle, autoplaySpeed = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef(null);
  const autoplayRef = useRef(null);

  useEffect(() => {
    if (items && items.length > 0) {
      startAutoplay();
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [items, currentSlide]);

  const startAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    
    autoplayRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % items.length);
    }, autoplaySpeed);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    resetAutoplay();
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + items.length) % items.length);
    resetAutoplay();
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % items.length);
    resetAutoplay();
  };

  const resetAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    startAutoplay();
  };

  // If no items to display
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="slideshow-section">
      <div className="container">
        {(title || subtitle) && (
          <div className="section-header">
            {title && <h2 className="section-title">{title}</h2>}
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
        )}
        
        <div className="slideshow-container" ref={slideRef}>
          <div className="slides">
            {items.map((item, index) => (
              <div 
                key={item._id || index} 
                className={`slide ${index === currentSlide ? 'active' : ''}`}
                style={{ transform: `translateX(${100 * (index - currentSlide)}%)` }}
                aria-hidden={index !== currentSlide}
              >
                <div className="slide-image-container">
                  <img src={item.image} alt={item.name} className="slide-image" />
                  <div className="slide-tag">${item.price} / night</div>
                </div>
                <div className="slide-content">
                  <h3 className="slide-title">{item.name}</h3>
                  <p className="slide-location">{item.location}</p>
                  <p className="slide-description">
                    {item.description.length > 120 ? `${item.description.substring(0, 120)}...` : item.description}
                  </p>
                  <div className="slide-footer">
                    <span className="slide-rooms">
                      <i className="room-icon">🛏️</i> {item.rooms} Rooms Available
                    </span>
                    <Link to={`/book/${item._id}`} className="slide-button">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="slide-nav prev" 
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            &#10094;
          </button>
          <button 
            className="slide-nav next" 
            onClick={nextSlide}
            aria-label="Next slide"
          >
            &#10095;
          </button>
          
          <div className="slide-indicators">
            {items.map((_, index) => (
              <button 
                key={index} 
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === currentSlide}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slideshow;