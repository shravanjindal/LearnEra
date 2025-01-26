import React from 'react';
import type { NextPage } from 'next';
import Navbar from '@/components/landingPage/Navbar';
import Footer from '@/components/landingPage/Footer';
import FAQs from '@/components/landingPage/FAQs';
import Testimonials from '@/components/landingPage/Testimonials';
import Pricing from '@/components/landingPage/Pricing';
import Hero from '@/components/landingPage/Hero';
import Working from '@/components/landingPage/Working';
const Home: NextPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Working />
      <Testimonials />
      <Pricing />
      <FAQs />
      <Footer />
    </div>
  );
};

export default Home;
