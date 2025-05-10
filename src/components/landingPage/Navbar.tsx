"use client"
import React, { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const Navbar: NextPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  
  const handleMenu = () => {
    setIsMenuOpen(false)
  }

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-slate-900/90 backdrop-blur-md shadow-lg" 
          : "bg-gradient-to-b from-slate-900 via-slate-800/95 to-slate-900/80"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link href={"/p"}>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Zovite</h1>
            <b className="text-xl pt-1 text-cyan-400">.co</b>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <ul className="md:flex space-x-6 pt-2">
            <li>
              <Link href="/product" className="text-slate-300 hover:text-cyan-400 transition-colors duration-200">
                Product
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-slate-300 hover:text-cyan-400 transition-colors duration-200">
                Login
              </Link>
            </li>
          </ul>
          <Link href="/welcome">
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 border-0">
              Get Started
            </Button>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 shadow-lg">
            <ul className="flex flex-col space-y-4 p-4">
              <li>
                <Link 
                  href="#pricing" 
                  onClick={handleMenu} 
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 block py-2"
                >
                  Premium
                </Link>
              </li>
              <li>
                <Link 
                  href="/explore" 
                  onClick={handleMenu}
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 block py-2"
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link 
                  href="/product" 
                  onClick={handleMenu}
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 block py-2"
                >
                  Product
                </Link>
              </li>
              <li>
                <Link 
                  href="/login" 
                  onClick={handleMenu}
                  className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 block py-2"
                >
                  Login
                </Link>
              </li>
            </ul>
            <div className="p-4 pt-0">
              <Link href="/welcome" onClick={handleMenu}>
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 border-0">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar
