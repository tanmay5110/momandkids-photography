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
    thumbnail: 'baby-shower/201',
    link: '/gallery/baby-shower',
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-16 bg-gradient-to-b from-[#F5F5DC] to-[#FFF8E7] relative">
      {/* Decorative top divider */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4A574] to-transparent"></div>
          <div className="w-2 h-2 bg-[#D4A574] rotate-45"></div>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4A574] to-transparent"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-[#8B7355] mb-3 uppercase tracking-widest text-sm font-medium">Our Work</p>
          <h2 className="text-4xl md:text-5xl font-light text-[#3E2723] mb-6">Portfolio</h2>
          <div className="w-16 h-px bg-[#D4A574] mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {portfolioCategories.map((category, index) => (
            <div key={index} className="group">
              <Link href={category.link} className="block">
                <div 
                  className="relative overflow-hidden aspect-[3/2] cursor-pointer mb-3 sm:mb-4 border-4 border-[#FFF8E7] shadow-lg hover:shadow-2xl bg-[#F5DEB3] transition-all duration-500"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <CldImage
                    src={category.thumbnail}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/30 via-transparent to-transparent group-hover:from-[#D4A574]/20 transition-all duration-500 z-10" />
                </div>
              </Link>
              <Link
                href={category.link}
                className="block text-center border-2 border-[#D4A574] text-[#3E2723] py-2 sm:py-2.5 text-xs sm:text-sm tracking-wide hover:bg-[#D4A574] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {category.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
