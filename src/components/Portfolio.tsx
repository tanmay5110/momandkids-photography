'use client';

import Link from 'next/link';
import { CldImage } from 'next-cloudinary';

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

        {/* ─── Vertical stack on mobile, 3-col grid on desktop ─── */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:gap-3 lg:gap-4 max-w-6xl mx-auto">
          {portfolioCategories.map((category, index) => (
            <div key={index} className="group">
              <Link href={category.link} className="block">
                <div
                  className="relative overflow-hidden aspect-[4/3] cursor-pointer bg-[#F5DEB3] transition-all duration-500"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <CldImage
                    src={category.thumbnail}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 320px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    draggable={false}
                  />
                  {/* Subtle gradient for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10" />
                  
                  {/* Title at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <h3 className="text-white text-lg md:text-sm lg:text-base font-[family-name:var(--font-cormorant)] font-semibold tracking-wide">
                      {category.title}
                    </h3>
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
