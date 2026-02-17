'use client';

import { Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white shadow-lg py-2 md:py-2.5' 
          : 'bg-transparent py-4 md:py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="Mom and Kids" 
            className={`w-auto object-contain transition-all duration-500 ${
              scrolled ? 'h-10 sm:h-12 md:h-14' : 'h-14 sm:h-16 md:h-20'
            }`}
            style={{ 
              background: 'transparent',
              backgroundColor: 'transparent',
              boxShadow: 'none',
              border: 'none',
              outline: 'none'
            }}
            onError={(e) => {
              // Fallback to text if logo doesn't exist
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <h1 
            className={`text-base sm:text-lg md:text-xl font-light tracking-wider transition-colors duration-500 ${
              scrolled ? 'text-gray-900' : 'text-white drop-shadow-lg'
            }`}
            style={{ display: 'none' }}
          >
            Mom and Kids
          </h1>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <a
            href="#home"
            className={`font-light text-sm tracking-wide transition-colors duration-300 ${
              scrolled ? 'text-gray-900 hover:text-[#D4A574]' : 'text-white hover:text-[#F5DEB3]'
            }`}
          >
            Home
          </a>
          <a
            href="#about"
            className={`font-light text-sm tracking-wide transition-colors duration-300 ${
              scrolled ? 'text-gray-900 hover:text-[#D4A574]' : 'text-white hover:text-[#F5DEB3]'
            }`}
          >
            About Us
          </a>
          <a
            href="#portfolio"
            className={`font-light text-sm tracking-wide transition-colors duration-300 ${
              scrolled ? 'text-gray-900 hover:text-[#D4A574]' : 'text-white hover:text-[#F5DEB3]'
            }`}
          >
            Portfolio
          </a>
          <a
            href="#testimonials"
            className={`font-light text-sm tracking-wide transition-colors duration-300 ${
              scrolled ? 'text-gray-900 hover:text-[#D4A574]' : 'text-white hover:text-[#F5DEB3]'
            }`}
          >
            Testimonials
          </a>
        </nav>

        <a
          href="tel:+919321130477"
          className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 border-2 transition-all duration-500 ${
            scrolled
              ? 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
              : 'border-white text-white hover:bg-white hover:text-gray-900'
          }`}
        >
          <Phone size={14} className="sm:w-4 sm:h-4" />
          <span className="font-light text-xs sm:text-sm hidden xs:inline">+91 9321130477</span>
          <span className="font-light text-xs sm:text-sm xs:hidden">Call</span>
        </a>
      </div>
    </header>
  );
}
