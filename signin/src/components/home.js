import React from 'react';
import HeroSection from './hero';
import Navbar from './navbar';
import Footer from './footer';

const Home = () => {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <Footer />
        </div>
    );
};

export default Home;