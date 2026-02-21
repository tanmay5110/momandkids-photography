'use client';

import { Phone, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CldImage } from 'next-cloudinary';

interface GalleryHeaderProps {
  title?: string;
  description?: string;
  imageCount?: number;
  coverImage?: string;
}

export default function GalleryHeader({ title, description, imageCount, coverImage }: GalleryHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            <Link href="/#home" className="font-light text-sm tracking-wide text-gray-900 hover:text-[#D4A574] transition-colors duration-300">Home</Link>
            <Link href="/#about" className="font-light text-sm tracking-wide text-gray-900 hover:text-[#D4A574] transition-colors duration-300">About Us</Link>
            <Link href="/#portfolio" className="font-light text-sm tracking-wide text-gray-900 hover:text-[#D4A574] transition-colors duration-300">Portfolio</Link>
            <Link href="/#testimonials" className="font-light text-sm tracking-wide text-gray-900 hover:text-[#D4A574] transition-colors duration-300">Testimonials</Link>
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

      {/* Hero Banner */}
      <div className="relative w-full mt-16 md:mt-20 overflow-hidden" onContextMenu={(e) => e.preventDefault()}>
        {/* Background cover image */}
        <div className="relative h-[50vh] md:h-[60vh] w-full">
          {coverImage ? (
            <CldImage
              src={coverImage}
              fill
              sizes="100vw"
              alt={title || 'Gallery'}
              className="object-cover"
              quality="auto"
              format="auto"
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#F5DEB3] via-[#E8D5B7] to-[#D4A574]" />
          )}
          
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10" />
          
          {/* Content over image */}
          <div className="absolute inset-0 z-20 flex items-end">
            <div className="container mx-auto px-4 pb-10 md:pb-14">
              {/* Back link */}
              <Link 
                href="/#portfolio" 
                className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors font-sans"
              >
                <ArrowLeft size={16} />
                <span>Back to Portfolio</span>
              </Link>
              
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white font-[family-name:var(--font-cormorant)] italic tracking-tight leading-tight">
                  {title || 'Gallery'}
                </h1>
                
                {description && (
                  <p className="text-white/80 text-base md:text-lg font-light mt-4 max-w-xl leading-relaxed font-sans">
                    {description}
                  </p>
                )}
                
                {imageCount && (
                  <div className="flex items-center gap-4 mt-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-px bg-[#D4A574]"></div>
                      <span className="text-[#D4A574] text-sm font-medium tracking-wide font-sans">
                        {imageCount} Photos
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
