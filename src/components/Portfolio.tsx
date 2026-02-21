'use client';

import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const portfolioCategories = [
  {
    title: 'Maternity',
    thumbnail: 'thumbnails/maternity',
    link: '/gallery/maternity',
  },
  {
    title: 'Newborn',
    thumbnail: 'thumbnails/newborn',
    link: '/gallery/newborn',
  },
  {
    title: '6-9 Months',
    thumbnail: 'thumbnails/6-to-9-months',
    link: '/gallery/6-9-months',
  },
  {
    title: 'Pre Birthday',
    thumbnail: 'thumbnails/pre-birthday',
    link: '/gallery/pre-birthday',
  },
  {
    title: 'Cake Smash',
    thumbnail: 'thumbnails/cake-smash',
    link: '/gallery/cake-smash',
  },
  {
    title: 'Kids Above 2 Years',
    thumbnail: 'thumbnails/kids-above-2',
    link: '/gallery/kids-above-2',
  },
  {
    title: 'Birthday Events',
    thumbnail: 'thumbnails/birthday-events',
    link: '/gallery/birthday-events',
  },
  {
    title: 'Baby Shower',
    thumbnail: 'baby-shower/SVP00020NK',
    link: '/gallery/baby-shower',
  },
  {
    title: 'Family Shoot',
    thumbnail: 'family-shoot/1',
    link: '/gallery/family-shoot',
  },
];

export default function Portfolio() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Auto-advance carousel on mobile
  useEffect(() => {
    if (!isMobile) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % portfolioCategories.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isMobile]);

  // Sync scroll position to currentIndex on mobile
  useEffect(() => {
    if (!isMobile || !scrollRef.current) return;
    const container = scrollRef.current;
    const card = container.children[currentIndex] as HTMLElement;
    if (card) {
      container.scrollTo({ left: card.offsetLeft - (container.offsetWidth - card.offsetWidth) / 2, behavior: 'smooth' });
    }
  }, [currentIndex, isMobile]);

  const goTo = (dir: 'prev' | 'next') => {
    setCurrentIndex((prev) => {
      if (dir === 'prev') return (prev - 1 + portfolioCategories.length) % portfolioCategories.length;
      return (prev + 1) % portfolioCategories.length;
    });
  };

  // Handle snap scroll end on mobile to update currentIndex
  useEffect(() => {
    if (!isMobile || !scrollRef.current) return;
    const container = scrollRef.current;
    let timeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const scrollLeft = container.scrollLeft;
        const cardWidth = container.children[0]?.clientWidth || 1;
        const gap = 16;
        const idx = Math.round(scrollLeft / (cardWidth + gap));
        setCurrentIndex(Math.min(idx, portfolioCategories.length - 1));
      }, 100);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => { container.removeEventListener('scroll', handleScroll); clearTimeout(timeout); };
  }, [isMobile]);

  return (
    <section id="portfolio" className="py-10 md:py-12 lg:py-14 bg-gradient-to-b from-[#F5F5DC] to-[#FFF8E7] relative">
      {/* Decorative top divider */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4A574] to-transparent"></div>
          <div className="w-2 h-2 bg-[#D4A574] rotate-45"></div>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4A574] to-transparent"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <p className="text-[#8B7355] mb-2 uppercase tracking-[0.25em] text-xs font-medium font-sans">Our Work</p>
          <h2 className="text-4xl md:text-5xl font-light text-[#3E2723] mb-4 font-[family-name:var(--font-cormorant)] italic">Portfolio</h2>
          <div className="w-16 h-px bg-[#D4A574] mx-auto"></div>
        </div>

        {/* ─── MOBILE: Horizontal carousel with snap ─── */}
        <div className="md:hidden relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {portfolioCategories.map((category, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-[80vw] snap-center transition-all duration-500 ${
                  index === currentIndex ? 'scale-100 opacity-100' : 'scale-[0.92] opacity-60'
                }`}
              >
                <Link href={category.link} className="block group">
                  <div
                    className="relative overflow-hidden aspect-[3/4] rounded-2xl shadow-xl bg-[#F5DEB3]"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <CldImage
                      src={category.thumbnail}
                      alt={category.title}
                      fill
                      sizes="80vw"
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                      draggable={false}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />
                    {/* Title on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                      <h3 className="text-white text-2xl font-[family-name:var(--font-cormorant)] font-semibold tracking-wide">
                        {category.title}
                      </h3>
                      <p className="text-white/80 text-xs uppercase tracking-[0.2em] mt-1 font-sans">View Gallery →</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Carousel controls */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => goTo('prev')}
              className="w-10 h-10 rounded-full border-2 border-[#D4A574] text-[#D4A574] flex items-center justify-center hover:bg-[#D4A574] hover:text-white transition-all"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5">
              {portfolioCategories.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'w-6 bg-[#D4A574]' : 'w-1.5 bg-[#D4A574]/30'
                  }`}
                  aria-label={`Go to ${portfolioCategories[i].title}`}
                />
              ))}
            </div>
            <button
              onClick={() => goTo('next')}
              className="w-10 h-10 rounded-full border-2 border-[#D4A574] text-[#D4A574] flex items-center justify-center hover:bg-[#D4A574] hover:text-white transition-all"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* ─── DESKTOP: 3×3 grid fitted to viewport ─── */}
        <div className="hidden md:grid grid-cols-3 gap-3 lg:gap-4 max-w-6xl mx-auto">
          {portfolioCategories.map((category, index) => (
            <div key={index} className="group">
              <Link href={category.link} className="block">
                <div
                  className="relative overflow-hidden aspect-[4/3] cursor-pointer rounded-lg shadow-md hover:shadow-2xl bg-[#F5DEB3] transition-all duration-500"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <CldImage
                    src={category.thumbnail}
                    alt={category.title}
                    fill
                    sizes="(max-width: 1024px) 33vw, 320px"
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    draggable={false}
                  />
                  {/* Hover overlay with title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
                  
                  {/* Always-visible title at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 z-20">
                    <h3 className="text-white text-sm lg:text-base font-[family-name:var(--font-cormorant)] font-semibold tracking-wide drop-shadow-lg">
                      {category.title}
                    </h3>
                    <span className="text-white/0 group-hover:text-white/80 text-[10px] uppercase tracking-[0.2em] transition-all duration-500 font-sans">
                      View Gallery →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
