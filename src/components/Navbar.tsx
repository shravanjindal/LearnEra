"use client"
import React, { useState } from 'react';
import type { NextPage } from 'next';
import { Button } from './ui/button';
const Navbar: NextPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white text-center px-6">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <h1 className="text-2xl pt-2 font-bold">LearnEra</h1>

        {/* Desktop Navigation Links */}
        <div className='flex space-x-6'>
        <ul className="hidden md:flex space-x-6 pt-2">
          <li>
            <a href="#" className="hover:text-gray-300 transition-colors duration-200">
              Products
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300 transition-colors duration-200">
              Blog
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300 transition-colors duration-200">
              Contact
            </a>
          </li>
        </ul>
        <Button className="hover:bg-gray-300 hove:scale-105 bg-white text-blue-500 transition-colors duration-200">
              Get Started
            </Button>
          </div>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white">
            <ul className="flex flex-col space-y-4 p-4">
              <li>
                <a href="#hero" className="hover:text-gray-300 transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-gray-300 transition-colors duration-200">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-gray-300 transition-colors duration-200">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-gray-300 transition-colors duration-200">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-gray-300 transition-colors duration-200">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;