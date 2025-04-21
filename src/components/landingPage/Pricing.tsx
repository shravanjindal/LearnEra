"use client"
import React from 'react';
import PricingCard from './cards/PricingCard';

const Pricing = () => {
  return (
    <section  id="premium" className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white py-20 px-6">
      <div className="container mx-auto text-center">
        <h3 className="text-5xl font-bold mb-3">Get Started today!</h3>
        <p className="text-xl text-blue-200 mb-12">Flexible plans tailored to meet your needs.</p>

        <div className="mt-8 flex flex-wrap justify-center gap-10">
          <PricingCard
            plan='FREE'
            price='0'
            target='Free-tier features'
            perks={["Get to know the product", "Learn few skills", "50 Free Tokens"]}
           
          />
          <PricingCard
            plan='PREMIUM'
            price='0.1'
            target='Perfect for upskilling'
            perks={[
              "You are ready to upskill",
              "Learn more skills",
              "Track your growth",
              "Recieve personalized tasks",
              "Buffer-free",
              "Paid Tokens"
            ]}
            
          />
        </div>
      </div>

      
    </section>
  );
};

export default Pricing;
