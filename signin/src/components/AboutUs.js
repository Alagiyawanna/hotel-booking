import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <h2 className="about-title">About StaySphere</h2>
        <div className="about-content">
          <div className="about-image-container">
            <img 
              src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2070&auto=format&fit=crop" 
              alt="Luxury hotel lobby" 
              className="about-image" 
            />
          </div>
          <div className="about-text">
            <h3>Welcome to Your Dream Destination</h3>
            <p>
              StaySphere was founded in 2023 with a simple mission: make luxury travel accessible to everyone. 
              We believe that finding and booking the perfect accommodation should be as enjoyable as the stay itself.
            </p>
            <p>
              Our platform offers a curated selection of premium hotels and resorts around the world, each one 
              personally verified by our team to ensure the highest standards of quality, comfort, and service.
            </p>
            <h3>What Sets Us Apart</h3>
            <ul className="about-features">
              <li>
                <span className="feature-highlight">Verified Listings</span> — Every hotel on our platform 
                is personally verified for quality and accuracy
              </li>
              <li>
                <span className="feature-highlight">Best Rate Guarantee</span> — We match or beat any 
                comparable price you find elsewhere
              </li>
              {/* <li>
                <span className="feature-highlight">Flexible Booking</span> — Change or cancel your 
                reservation with ease
              </li>
              <li>
                <span className="feature-highlight">24/7 Support</span> — Our dedicated team is always 
                ready to assist you
              </li>  */}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;