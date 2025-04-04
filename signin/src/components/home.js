import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './footer';
import AboutUs from './AboutUs';
import Slideshow from './Slideshow';
import './home.css';
import config from '../config';

const Home = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch hotels on initial load
        fetchHotels();
    }, []);

    const fetchHotels = () => {
        setLoading(true);
        axios.get(`${config.API_URL}/api/hotels`)
            .then(response => { 
                setHotels(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    };

    return (
        <div className="home-page">
            <Navbar />
            
            {/* Hero Section without Search & Filters */}
            <section className="hero-section">
                <div className="hero-content">
                    {/* <h1>Welcome to Your Dream Stay</h1> */}
                    <p>Book your perfect hotel stay with ease and comfort.</p>
                </div>
            </section>
            
            {/* Hotel Slideshow */}
            {!loading && hotels.length > 0 && (
                <Slideshow 
                    items={hotels} 
                    title="Featured Hotels" 
                    subtitle="Discover our handpicked selection of exceptional accommodations"
                    autoplaySpeed={6000}
                />
            )}
            
            {/* About Us Section */}
            <AboutUs />
            
            {/* Call to Action Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-container">
                        <h2 className="cta-title">Ready for Your Next Adventure?</h2>
                        <p className="cta-text">
                            Discover perfect accommodations for your next adventure. 
                            From luxury hotels to cozy retreats, we have the ideal place for every traveler.
                        </p>
                        <Link to="/hotels" className="cta-button">
                            Explore All Hotels
                        </Link>
                    </div>
                </div>
            </section>
            
            <Footer />
        </div>
    );
};

export default Home;