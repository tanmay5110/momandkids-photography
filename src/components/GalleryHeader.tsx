'use client';

import { Phone } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface GalleryHeaderProps {
  title?: string;
  description?: string;
  imageCount?: number;
}

const maternitySlides = [
  {
    image: 'maternity/856',
    title: 'Celebrating Motherhood',
    subtitle: 'Beautiful Moments, Timeless Memories',
    description: 'Capturing the radiant glow and anticipation of your journey into motherhood',
  },
  {
    image: 'maternity/801',
    title: 'The Magic of Expecting',
    subtitle: 'Cherishing Every Precious Moment',
    description: 'Professional maternity photography that celebrates your beautiful transformation',
  },
  {
    image: 'maternity/488',
    title: 'Your Journey Begins',
    subtitle: 'Elegant & Timeless Portraits',
    description: 'Creating stunning portraits that honor this special chapter in your life',
  },
];

export default function GalleryHeader({ title, description, imageCount }: GalleryHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (imageCount) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % maternitySlides.length);
      }, 6000);

      return () => clearInterval(timer);
    }
  }, [imageCount]);

  const slide = maternitySlides[currentSlide];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-lg transition-all duration-500 ${
          scrolled ? 'py-2 md:py-2.5' : 'py-3 md:py-4'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Mom and Kids" 
              className={`w-auto object-contain transition-all duration-500 ${
                scrolled ? 'h-10 sm:h-12 md:h-14' : 'h-12 sm:h-14 md:h-16'
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
              className="text-base sm:text-lg md:text-xl font-light tracking-wider text-gray-900"
              style={{ display: 'none' }}
            >
              Mom and Kids
            </h1>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/#home"
              className="font-light text-sm tracking-wide text-gray-900 hover:text-[#D4A574] transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              href="/#about"
              className="font-light text-sm tracking-wide text-gray-900 hover:text-[#D4A574] transition-colors duration-300"
            >
              About Us
            </Link>
            <Link
              href="/#portfolio"
              className="font-light text-sm tracking-wide text-gray-900 hover:text-[#D4A574] transition-colors duration-300"
            >
              Portfolio
            </Link>
            <Link
              href="/#testimonials"
              className="font-light text-sm tracking-wide text-gray-900 hover:text-[#D4A574] transition-colors duration-300"
            >
              Testimonials
            </Link>
          </nav>

          <a
            href="tel:+919321130477"
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-500"
          >
            <Phone size={14} className="sm:w-4 sm:h-4" />
            <span className="font-light text-xs sm:text-sm hidden xs:inline">+91 9321130477</span>
            <span className="font-light text-xs sm:text-sm xs:hidden">Call</span>
          </a>
        </div>
      </header>

      {imageCount && (
        <div className="relative w-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 mt-16 md:mt-20 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-sm md:text-base font-light tracking-widest uppercase text-pink-600">
                Beautiful Moments, Timeless Memories
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900">
                {title || 'Maternity Gallery'}
              </h1>
              <p className="text-base md:text-lg lg:text-xl font-light leading-relaxed text-gray-700 max-w-2xl mx-auto">
                {description || 'Capturing the radiant glow and anticipation of your journey into motherhood'}
              </p>
              <p className="text-sm md:text-base text-gray-600 font-medium pt-4">
                {imageCount} beautiful moments captured
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
