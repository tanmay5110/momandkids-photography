'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CldImage } from 'next-cloudinary';

// Hero slider images from Cloudinary
const slides = [
  { publicId: 'hero-slider/1', title: 'Slide 1' },
  { publicId: 'hero-slider/2', title: 'Slide 2' },
  { publicId: 'hero-slider/4', title: 'Slide 4' },
  { publicId: 'hero-slider/5', title: 'Slide 5' },
  { publicId: 'hero-slider/6', title: 'Slide 6' },
  { publicId: 'hero-slider/7', title: 'Slide 7' },
  { publicId: 'hero-slider/8', title: 'Slide 8' },
  { publicId: 'hero-slider/9', title: 'Slide 9' },
  { publicId: 'hero-slider/10', title: 'Slide 10' },
  { publicId: 'hero-slider/11', title: 'Slide 11' },
  { publicId: 'hero-slider/12', title: 'Slide 12' },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full overflow-hidden h-[75svh] md:h-screen min-h-[400px]" onContextMenu={(e) => e.preventDefault()}>
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <CldImage
            src={slide.publicId}
            alt={slide.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0 || index === 1}
            quality={85}
            draggable={false}
          />
          {/* Invisible overlay */}
          <div className="absolute inset-0 z-10" />
        </div>
      ))}

      <button
        onClick={goToPrevious}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 sm:p-2 text-gray-800 transition hover:bg-white z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 sm:p-2 text-gray-800 transition hover:bg-white z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 flex -translate-x-1/2 gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-6 sm:w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
