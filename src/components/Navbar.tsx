"use client"
import React, { useState } from 'react';
import type { NextPage } from 'next';
import { Button } from './ui/button';
import Link from 'next/link';
const Navbar: NextPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleMenu = () =>{
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white text-center px-6">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link href={"/"}><h1 className="text-2xl pt-2 font-bold">LearnEra</h1></Link>


        {/* Desktop Navigation Links */}
        <div className='hidden md:flex space-x-6 '>
          <ul className="md:flex space-x-6 pt-2">
            <li>
              <Link href="#pricing" className="hover:text-blue-200 transition-colors duration-200">
                Premium
              </Link>
            </li>
            <li>
              <Link href="/explore" className="hover:text-blue-200 transition-colors duration-200">
                Explore
              </Link>
            </li>
            <li>
              <Link href="/product" className="hover:text-blue-200 transition-colors duration-200">
                Product
              </Link>
            </li>
          </ul>
          <Link href='/onboarding'><Button className="mt-1 hover:bg-blue-200 hove:scale-105 bg-white text-blue-500 transition-colors duration-200">
            Get Started
          </Button></Link>
          
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
              <Link href="#pricing" onClick={handleMenu} className="hover:text-blue-200 transition-colors duration-200">
                Premium
              </Link>
            </li>
            <li>
              <Link href="/explore" className="hover:text-blue-200 transition-colors duration-200">
                Explore
              </Link>
            </li>
            <li>
              <Link href="/product" className="hover:text-blue-200 transition-colors duration-200">
                Product
              </Link>
            </li>
            </ul>
            <Link href='/onboarding'><Button className="mb-7 mt-1 hover:bg-blue-200 hove:scale-105 bg-white text-blue-500 transition-colors duration-200">
            Get Started
          </Button></Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;