"use client";
import Link from 'next/link';
import React from 'react';

interface PricingCardProps {
  plan: string;
  target: string;
  price: string;
  perks?: string[]; // Make perks optional and define it as an array of strings
}

const handlePayments = (text) => {
  if (text === "Get Started") return "/onboarding";
  else return "";
};

const PricingCard: React.FC<PricingCardProps> = ({ plan, target, price, perks = [] }) => {
  // Determine button text based on the plan
  const buttonText = plan.toUpperCase() === "FREE" ? "Get Started" : "Contact us";

  // Determine card size and border based on the plan
  const cardClasses = `bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 flex flex-col`;
  const cardId = `${plan === "PREMIUM" ? "premium" : ""}`;

  return (
    <div id={cardId} className={cardClasses}>
      {/* Card Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-center py-6">
        <h3 className="text-2xl font-bold">{plan}</h3>
        <p className="text-sm text-purple-200 mt-1">{target}</p>
      </div>

      {/* Card Body */}
      <div className="p-6 text-center flex flex-col flex-grow">
        {/* Price */}
        <p className="text-4xl font-bold text-gray-800">
          {price}<span className="text-lg text-gray-600">/day</span>
        </p>

        {/* Features List */}
        <ul className="mt-6 space-y-3 flex-grow">
          {perks.map((perk, index) => (
            <li key={index} className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">{perk}</span>
            </li>
          ))}
        </ul>

        {/* Dynamic Button */}
        <Link href={handlePayments(buttonText)}>
          <button
            className="mt-8 w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-colors duration-300"
          >
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PricingCard;