import React from 'react';
import HeroSection from '../components/home/HeroSection';
import GovernmentImpact from '../components/home/GovernmentImpact';
import FeatureCards from '../components/home/FeatureCards';
import StatsSection from '../components/home/StatsSection';

const HomePage = () => {
  return (
    <div className="homepage-government">
      <HeroSection />
      <GovernmentImpact />
      <FeatureCards />
   
    </div>
  );
};

export default HomePage;
